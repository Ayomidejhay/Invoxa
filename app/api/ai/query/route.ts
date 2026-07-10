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

    // 3. Parse user prompt from request body
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing or invalid prompt in request body" }, { status: 400 });
    }

    // 4. Retrieve organization settings (e.g., currency, name)
    const { data: org } = await supabase
      .from("organizations")
      .select("name, currency")
      .eq("id", orgId)
      .single();

    if (!org) {
      return NextResponse.json({ error: "Organization details not found" }, { status: 404 });
    }

    // 5. Fetch all relevant tables (constrained by RLS via user session)
    const [invoicesRes, customersRes, productsRes, paymentsRes, itemsRes] = await Promise.all([
      supabase
        .from("invoices")
        .select("id, invoice_number, total, amount_paid, status, type, currency, created_at, issue_date, due_date, customer_id")
        .eq("organization_id", orgId),
      supabase
        .from("customers")
        .select("id, name, email, phone")
        .eq("organization_id", orgId),
      supabase
        .from("products")
        .select("id, name, sku, sale_price, rental_price, stock")
        .eq("organization_id", orgId),
      supabase
        .from("payments")
        .select("id, invoice_id, amount, note, created_at")
        .eq("organization_id", orgId),
      supabase
        .from("invoice_items")
        .select("invoice_id, product_id, name, quantity, unit_price, total_price")
    ]);

    if (invoicesRes.error || customersRes.error || productsRes.error || paymentsRes.error || itemsRes.error) {
      console.error("Database fetch failed:", {
        invoices: invoicesRes.error,
        customers: customersRes.error,
        products: productsRes.error,
        payments: paymentsRes.error,
        items: itemsRes.error,
      });
      return NextResponse.json({ error: "Failed to load database records for analysis" }, { status: 500 });
    }

    // Compile datasets
    const contextData = {
      organization: {
        name: org.name,
        currency: org.currency,
      },
      customers: customersRes.data || [],
      products: productsRes.data || [],
      invoices: invoicesRes.data || [],
      payments: paymentsRes.data || [],
      invoiceItems: itemsRes.data || [],
      currentDate: new Date().toISOString().split("T")[0],
    };

    // 6. Check for Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        error: "GEMINI_API_KEY is not configured in the environment variables. Please add it to your .env.local file."
      }, { status: 500 });
    }

    // 7. Call Gemini REST API directly with responseSchema constraint
    const systemPrompt = `You are the Invoxa Business Analyst, an AI assistant embedded in the dashboard of Invoxa (an invoicing, rental, and inventory management web app).
You help organization owners and staff analyze their sales, rental transactions, outstanding balances, customer behavior, and inventory levels.

You are provided with a complete JSON snapshot of the organization's business records:
- Invoices
- Payments
- Products
- Customers
- Invoice Items
- Current date is: ${contextData.currentDate}

Your task is to analyze these records and answer the user's question. Follow these guidelines:
1. Rely strictly on the provided JSON data. If the database is empty or doesn't contain enough information to answer a question, state this clearly.
2. Be precise in your calculations. If the user asks for revenue, sum up the 'amount_paid' field from invoices or payments, not the invoice totals (unless they ask for total invoiced amounts).
3. Do NOT show internal Database IDs (UUIDs) in your response. Instead, refer to customers, products, and invoices by their names, SKUs, or invoice numbers.
4. Format your narrative response in the 'text' field using clean, readable Markdown. Use lists, tables, bold text, or inline quotes where appropriate.
5. If the user's question involves a comparison, trend, distribution, or data breakdown that can be visually graphed (e.g., "sales vs rentals count", "revenue trend over time", "top customers by spending", "product stock levels"), you MUST populate the 'chart' object.
   - For trends over time (monthly, weekly, daily revenue), use 'line' type.
   - For comparisons or lists (top customers, product quantities, sales vs rentals), use 'bar' type.
   - For distributions (e.g., status count, invoices by type), use 'pie' or 'bar' type.
   - In the 'chart.data' array, ensure every object has exactly two keys: "label" (the name/category/date) and "value" (the quantity/amount). The xAxisKey must be "label" and yAxisKey must be "value". Keep the dates in readable formats (e.g. 'Jan 2026' or '2026-07-09').`;

    const userPrompt = `Database Context JSON:
${JSON.stringify(contextData, null, 2)}

User Question:
"${prompt}"`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userPrompt }],
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
              text: {
                type: "STRING",
                description: "The plain-text markdown response to the user's query.",
              },
              chart: {
                type: "OBJECT",
                description: "An optional chart structure if the answer is best represented visually.",
                properties: {
                  type: {
                    type: "STRING",
                    enum: ["bar", "line", "pie"],
                  },
                  title: { type: "STRING" },
                  data: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        label: { type: "STRING" },
                        value: { type: "NUMBER" },
                      },
                      required: ["label", "value"],
                    },
                  },
                  xAxisKey: { type: "STRING" },
                  yAxisKey: { type: "STRING" },
                },
                required: ["type", "title", "data", "xAxisKey", "yAxisKey"],
              },
            },
            required: ["text"],
          },
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API call failed:", errorText);
      return NextResponse.json({ error: "Failed to communicate with the AI model." }, { status: 502 });
    }

    const geminiData = await geminiResponse.json();
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json({ error: "No response generated by the AI model." }, { status: 502 });
    }

    // The model is forced to return JSON string, so we parse it and send it directly
    try {
      const parsedOutput = JSON.parse(generatedText);
      return NextResponse.json(parsedOutput);
    } catch (parseErr) {
      console.error("Failed to parse Gemini JSON output:", generatedText, parseErr);
      return NextResponse.json({
        text: "I analyzed the data, but I encountered an formatting issue while generating the response. Please try asking again.",
      });
    }

  } catch (err: any) {
    console.error("Error in AI query route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
