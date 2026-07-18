import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function generatePDFBuffer(
  invoiceId: string,
  supabase: any,
  cookieHeader: string,
  origin: string
): Promise<Buffer> {
  // Initialize headless browser via Puppeteer
  let browser;
  const isProd = process.env.NODE_ENV === "production" || process.env.NETLIFY;

  if (isProd) {
    const { default: puppeteerCore } = await import("puppeteer-core");
    const chromiumModule = (await import("@sparticuz/chromium")) as any;
    const chromium = chromiumModule.default || chromiumModule;

    browser = await puppeteerCore.launch({
      args: [...chromium.args, "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    } as any);
  } else {
    const { default: localPuppeteer } = await import("puppeteer");
    browser = await localPuppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"],
      ignoreHTTPSErrors: true,
    } as any);
  }

  try {
    const page = await browser.newPage();

    // Set viewport to desktop resolution to render desktop design
    await page.setViewport({ width: 1280, height: 800 });

    // Force color scheme to light
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: "light" },
    ]);

    // Set cookies to authenticate session on the page
    if (cookieHeader) {
      const cookies = cookieHeader
        .split(";")
        .map((pair) => pair.trim())
        .filter((pair) => pair.length > 0)
        .map((pair) => {
          const [name, ...val] = pair.split("=");
          return {
            name: name.trim(),
            value: val.join("=").trim(),
            domain: new URL(origin).hostname,
            path: "/",
            secure: true,
          };
        });
      if (cookies.length > 0) {
        await page.setCookie(...cookies);
      }
    }

    // Navigate to the actual invoice page
    const invoicePageUrl = `${origin}/invoice/${invoiceId}`;
    await page.goto(invoicePageUrl, { waitUntil: "domcontentloaded" });

    // Wait for the invoice element to load and render completely
    await page.waitForSelector("#invoice", { timeout: 15000 });

    // Wait for all fonts to load
    await page.evaluateHandle(() => document.fonts.ready);

    // Wait for all images to load completely
    await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll("img"));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.addEventListener("load", resolve);
            img.addEventListener("error", resolve); // resolve anyway on error to prevent hanging
          });
        })
      );
    });

    // Emulate print media style
    await page.emulateMediaType("print");

    // Print contents to PDF format
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm",
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Retrieve invoice to verify auth membership
    const { data: invoice } = await supabase
      .from("invoices")
      .select("organization_id")
      .eq("id", id)
      .single();

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Check user membership inside the organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile || profile.organization_id !== invoice.organization_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const cookieHeader = request.headers.get("cookie") || "";
    const origin = new URL(request.url).origin;
    const pdfBuffer = await generatePDFBuffer(id, supabase, cookieHeader, origin);
    const filename = `invoice-${id.slice(0, 8)}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error("PDF generation failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
