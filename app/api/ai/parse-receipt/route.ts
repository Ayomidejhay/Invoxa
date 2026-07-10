import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Retrieve user's profile and organization ID
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile || !profile.organization_id) {
      return NextResponse.json({ error: "Forbidden: No organization context found." }, { status: 403 });
    }

    const orgId = profile.organization_id;

    // 3. Parse request body for file data
    const body = await request.json();
    const { fileData, mimeType } = body;

    if (!fileData || typeof fileData !== "string" || !mimeType || typeof mimeType !== "string") {
      return NextResponse.json({ error: "Missing or invalid fileData or mimeType in request body" }, { status: 400 });
    }

    // 4. Fetch catalogs (customers & products) for semantic matching
    const [customersRes, productsRes] = await Promise.all([
      supabase.from("customers").select("id, name").eq("organization_id", orgId),
      supabase.from("products").select("id, name, sku").eq("organization_id", orgId),
    ]);

    if (customersRes.error || productsRes.error) {
      console.error("Database fetch failed in receipt parser:", {
        customers: customersRes.error,
        products: productsRes.error,
      });
      return NextResponse.json({ error: "Failed to fetch catalogs for analysis matching" }, { status: 500 });
    }

    const customersCatalog = customersRes.data || [];
    const productsCatalog = productsRes.data || [];

    // 5. Verify Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        error: "GEMINI_API_KEY is not configured in the environment variables. Please add it to your .env.local file."
      }, { status: 500 });
    }

    // 6. Build prompt and invoke Gemini REST API
    const systemPrompt = `You are the Invoxa AI Receipt & Invoice Parser, an assistant designed to scan uploaded documents (receipts, supplier bills, purchase orders, or quotes) and extract structured billing information to populate a Next.js invoice form.

You are also provided with the organization's current catalog database:
- Customers Catalog: ${JSON.stringify(customersCatalog)}
- Products Catalog: ${JSON.stringify(productsCatalog)}

Your task is to analyze the attached document and perform semantic mapping:
1. Billed Customer: Extract the customer name. Match it against the Customers Catalog. If the document customer matches or is semantically equivalent to one in the catalog, return their 'id' in 'matchedCustomerId'. Otherwise, return an empty string "".
2. Transaction Type: Determine if the document represents a 'sale' (one-time buying) or 'rental' (daily charges, duration). Return 'sale' or 'rental'.
3. Invoice Items: Extract all items listed. For each item:
   - Match the item name semantically to a product in the Products Catalog. If it matches, return the product 'id' in 'matchedProductId'. Otherwise, return an empty string "".
   - Extract the quantity. Default to 1 if not specified.
4. Due Date: Extract the due date. Format as YYYY-MM-DD. Return an empty string "" if not found.
5. Notes: Extract any receipt numbers, reference IDs, payment terms, or summaries.

Format your output strictly according to the requested JSON schema. All fields must be returned. Use empty strings for missing/unmatched lookup fields.`;

    const userPrompt = `Please parse the attached receipt/invoice document and map it to our catalogs.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: userPrompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: fileData,
                },
              },
            ],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              customerName: {
                type: "STRING",
                description: "Name of the customer extracted from the document.",
              },
              matchedCustomerId: {
                type: "STRING",
                description: "The matched 'id' from the Customers Catalog, or empty string if no match found.",
              },
              type: {
                type: "STRING",
                enum: ["sale", "rental"],
                description: "Whether the invoice represents a sale or rental.",
              },
              dueDate: {
                type: "STRING",
                description: "Due date formatted as YYYY-MM-DD, or empty string if not found.",
              },
              notes: {
                type: "STRING",
                description: "Notes, references, payment terms, or invoice comments.",
              },
              items: {
                type: "ARRAY",
                description: "List of items parsed from the document.",
                items: {
                  type: "OBJECT",
                  properties: {
                    productName: { type: "STRING" },
                    matchedProductId: {
                      type: "STRING",
                      description: "The matched 'id' from the Products Catalog, or empty string if no match found.",
                    },
                    quantity: { type: "NUMBER" },
                  },
                  required: ["productName", "matchedProductId", "quantity"],
                },
              },
            },
            required: ["customerName", "matchedCustomerId", "type", "dueDate", "notes", "items"],
          },
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini receipt parser API call failed:", errorText);
      return NextResponse.json({ error: "Failed to communicate with the AI parser model." }, { status: 502 });
    }

    const geminiData = await geminiResponse.json();
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json({ error: "No parse response generated by the AI model." }, { status: 502 });
    }

    try {
      const parsedOutput = JSON.parse(generatedText);
      return NextResponse.json(parsedOutput);
    } catch (parseErr) {
      console.error("Failed to parse Gemini receipt JSON output:", generatedText, parseErr);
      return NextResponse.json({ error: "Failed to parse receipt data. Please try uploading again." }, { status: 502 });
    }

  } catch (err: any) {
    console.error("Error in receipt parser API route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
