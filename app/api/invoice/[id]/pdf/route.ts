import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

function formatCurrency(amount: number, code: string) {
  const symbolMap: Record<string, string> = {
    NGN: "₦",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };
  const symbol = symbolMap[code] || code;
  const formattedVal = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  
  const separator = symbol.length > 1 ? " " : "";
  return `${symbol}${separator}${formattedVal}`;
}

const daysBetween = (d1?: string, d2?: string) => {
  if (!d1 || !d2) return 0;
  const t1 = new Date(d1).getTime();
  const t2 = new Date(d2).getTime();
  const diff = Math.ceil((t2 - t1) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
};

// In-memory PDF generator helper that can be called directly by other API routes
export async function generatePDFBuffer(invoiceId: string, supabase: any): Promise<Buffer> {
  // Retrieve invoice and nested customer details
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*, customers(name, email, phone)")
    .eq("id", invoiceId)
    .single();

  if (invoiceError || !invoice) {
    throw new Error("Invoice not found");
  }

  // Retrieve organization business settings
  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", invoice.organization_id)
    .single();

  if (!org) {
    throw new Error("Organization not found");
  }

  // Retrieve invoice line items
  const { data: items } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("created_at", { ascending: true });

  const isRental = invoice.type === "rental";
  const currency = invoice.currency || "USD";

  // Retrieve bank details matching current currency
  const { data: bankAccount } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("organization_id", invoice.organization_id)
    .eq("currency", currency)
    .maybeSingle() as any;

  const grandTotal = items?.reduce((sum: number, item: any) => sum + (item.total_price || 0), 0) || 0;
  const balanceDue = Math.max(0, (invoice.total ?? grandTotal) - (invoice.amount_paid || 0));
  const primaryColor = org.primary_color || (isRental ? "#B7791F" : "#355834");

  // Construct the HTML page string with elegant styling
  const htmlString = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice #${invoice.invoice_number || invoice.id.slice(0, 8)}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
        
        @page {
          size: A4;
          margin: 15mm;
        }
        
        body {
          font-family: 'Inter', -apple-system, sans-serif;
          color: #0f172a;
          margin: 0;
          padding: 0;
          line-height: 1.5;
          background: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Plus Jakarta Sans', sans-serif;
          margin: 0;
        }

        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        .invoice-container {
          width: 100%;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          padding: 48px;
        }

        /* Watermark background */
        .watermark-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-12deg);
          width: 380px;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 0;
          opacity: 0.07;
          user-select: none;
        }

        .watermark-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .watermark-text {
          font-size: 260px;
          font-weight: 800;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0f172a;
          text-transform: uppercase;
          line-height: 1;
        }

        /* Header Section */
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 30px;
          margin-bottom: 30px;
        }

        .org-info h1 {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .org-info p {
          margin: 2px 0;
          font-size: 13px;
          color: #475569;
        }

        .invoice-meta {
          text-align: right;
        }

        .badge-row {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-bottom: 12px;
        }

        .badge {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: 9999px;
          display: inline-block;
        }

        .badge-sale {
          background-color: #EAF2EB;
          color: #355834;
        }

        .badge-rental {
          background-color: #FBF1DE;
          color: #B7791F;
        }

        /* Status Badges */
        .status-draft { background-color: #F1F5F9; color: #475569; }
        .status-sent { background-color: #DBEAFE; color: #1D4ED8; }
        .status-partial { background-color: #E0E7FF; color: #4338CA; }
        .status-paid { background-color: #DCFCE7; color: #15803D; }
        .status-overdue { background-color: #FEF3C7; color: #B45309; }
        .status-void { background-color: #FEE2E2; color: #B91C1C; }

        .invoice-meta h2 {
          font-size: 32px;
          font-weight: 300;
          letter-spacing: -0.02em;
          color: ${primaryColor};
          margin: 0 0 4px 0;
        }

        .invoice-meta .inv-number {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        /* Billing & Details Grid */
        .details-grid {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
          font-size: 13px;
        }

        .billing-block, .info-block {
          width: 48%;
        }

        .info-block {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .block-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          margin-bottom: 8px;
        }

        .billing-block p {
          margin: 3px 0;
          color: #475569;
        }

        .billing-block .cust-name {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 6px;
        }

        .info-row {
          display: flex;
          justify-content: flex-end;
          margin: 3px 0;
          color: #475569;
        }

        .info-row span.label {
          color: #94a3b8;
          margin-right: 6px;
        }

        .info-row span.val {
          font-weight: 500;
          color: #1e293b;
        }

        /* Items Table */
        table.items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          font-size: 13px;
        }

        table.items-table th {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          background-color: #f8fafc;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          padding: 10px 12px;
        }

        table.items-table td {
          padding: 12px;
          border-bottom: 1px solid #f1f5f9;
          color: #475569;
          vertical-align: top;
        }

        table.items-table td.desc-cell {
          color: #0f172a;
          font-weight: 500;
        }

        table.items-table td.desc-cell span.subtext {
          display: block;
          font-size: 11px;
          color: #94a3b8;
          font-weight: 400;
          margin-top: 2px;
        }

        table.items-table td.center-align {
          text-align: center;
        }

        table.items-table td.right-align {
          text-align: right;
        }

        table.items-table td.total-cell {
          color: #020617;
          font-weight: 600;
        }

        /* Calculations Summary */
        .summary-container {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 40px;
        }

        .summary-table {
          width: 280px;
          font-size: 13px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          color: #64748b;
        }

        .summary-row.total {
          font-size: 16px;
          font-weight: 700;
          color: ${primaryColor};
          border-top: 1px solid ${primaryColor};
          padding-top: 10px;
          margin-top: 4px;
        }

        .summary-row.paid {
          color: #16A34A;
        }

        .summary-row.due {
          font-weight: 700;
          border-top: 1px dashed #e2e8f0;
          padding-top: 8px;
          margin-top: 4px;
        }

        .summary-row.due.overdue-color {
          color: #B45309;
        }

        .summary-row.due.paid-color {
          color: #16A34A;
        }

        /* Sections Layout */
        .section-block {
          border-top: 1px solid #f1f5f9;
          padding-top: 20px;
          margin-top: 20px;
        }

        .section-block h4 {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          margin-bottom: 10px;
        }

        /* Bank details block */
        .bank-grid {
          display: flex;
          background-color: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 8px;
          padding: 15px;
          font-size: 12px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .bank-col {
          flex: 1;
          min-width: 120px;
        }

        .bank-col span.title {
          display: block;
          color: #94a3b8;
          margin-bottom: 2px;
        }

        .bank-col span.val {
          font-weight: 500;
          color: #1e293b;
        }

        .bank-col span.acc-num {
          font-weight: 700;
          font-size: 13px;
          color: #0f172a;
        }

        /* Terms block */
        .terms-p {
          font-size: 12px;
          color: #64748b;
          background-color: #fafbfc;
          border: 1px solid #f8fafc;
          border-radius: 8px;
          padding: 15px;
          margin: 0;
          white-space: pre-line;
          line-height: 1.6;
        }

        .notes-p {
          font-size: 12px;
          color: #64748b;
          margin: 0;
          white-space: pre-line;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Top branding border accent -->
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 6px; background-color: ${primaryColor};"></div>

        <div class="watermark-container">
          ${org?.logo_url ? `
            <img src="${org.logo_url}" class="watermark-img" crossorigin="anonymous" />
          ` : `
            <span class="watermark-text">${org?.name ? org.name[0] : "B"}</span>
          `}
        </div>
        
         <div class="header-row">
          <div style="display: flex; align-items: center; gap: 16px;">
            ${org?.logo_url ? `
              <img src="${org.logo_url}" crossorigin="anonymous" style="width: 56px; height: 56px; object-fit: cover; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);" />
            ` : `
              <div style="width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background-color: #0f172a; color: #ffffff; font-weight: 700; font-size: 20px; text-transform: uppercase;">
                ${org?.name ? org.name[0] : "B"}
              </div>
            `}
            <div class="org-info">
              <h1>${org?.name || "Business Name"}</h1>
              <p>${org?.email || ""}</p>
              <p>${org?.phone || ""}</p>
              <p style="margin-top: 4px; font-size: 11px; color: #94a3b8;">${org?.address || ""}</p>
            </div>
          </div>
          
          <div class="invoice-meta">
            <div class="badge-row">
              <span class="badge ${invoice.type === 'sale' ? 'badge-sale' : 'badge-rental'}">
                ${invoice.type}
              </span>
              <span class="badge status-${invoice.status || 'draft'}">
                ${invoice.status || 'draft'}
              </span>
            </div>
            <h2>INVOICE</h2>
            <p class="inv-number font-mono">#${invoice.invoice_number || invoice.id.slice(0, 8)}</p>
          </div>
        </div>

        <!-- Billing Info & Dates details -->
        <div class="details-grid">
          <div class="billing-block">
            <div class="block-title">Billed To</div>
            <p class="cust-name">${invoice.customers?.name || "Customer Name"}</p>
            ${invoice.customers?.email ? `<p>${invoice.customers.email}</p>` : ""}
            ${invoice.customers?.phone ? `<p>${invoice.customers.phone}</p>` : ""}
          </div>

          <div class="info-block">
            <div class="block-title">Details</div>
            
            ${invoice.issue_date ? `
              <div class="info-row">
                <span class="label">Date Issued:</span>
                <span class="val">${new Date(invoice.issue_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
            ` : ""}
            
            ${invoice.due_date ? `
              <div class="info-row">
                <span class="label">Due Date:</span>
                <span class="val">${new Date(invoice.due_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
            ` : ""}

            ${isRental && invoice.start_date ? `
              <div class="info-row">
                <span class="label">Rental Start:</span>
                <span class="val">${new Date(invoice.start_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
            ` : ""}

            ${isRental && invoice.end_date ? `
              <div class="info-row">
                <span class="label">Rental End:</span>
                <span class="val">${new Date(invoice.end_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
            ` : ""}
          </div>
        </div>

        <!-- Table of items -->
        <table class="items-table">
          <thead>
            <tr>
              <th style="text-align: left; width: 45%;">Description</th>
              ${isRental ? `<th style="text-align: center; width: 12%;">Days</th>` : ""}
              <th style="text-align: center; width: 10%;">Qty</th>
              <th style="text-align: right; width: 16%;">${isRental ? "Rate / day" : "Unit Price"}</th>
              <th style="text-align: right; width: 17%;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items?.map((it: any) => {
              const days = daysBetween(
                it.start_date || invoice.start_date || undefined,
                it.end_date || invoice.end_date || undefined
              );
              return `
                <tr>
                  <td class="desc-cell">
                    ${it.name || "Product"}
                    ${isRental ? `
                      <span class="subtext">
                        ${formatCurrency(it.unit_price || 0, currency)}/day × ${it.quantity} × ${days || 1} days
                      </span>
                    ` : ""}
                  </td>
                  ${isRental ? `<td class="center-align font-mono">${days || "-"}</td>` : ""}
                  <td class="center-align font-mono">${it.quantity}</td>
                  <td class="right-align font-mono">${formatCurrency(it.unit_price || 0, currency)}</td>
                  <td class="right-align total-cell font-mono">${formatCurrency(it.total_price || 0, currency)}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>

        <!-- Summary Block -->
        <div class="summary-container">
          <div class="summary-table">
            <div class="summary-row">
              <span>Subtotal</span>
              <span class="font-mono">${formatCurrency(grandTotal, currency)}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span class="font-mono">${formatCurrency(invoice.total ?? grandTotal, currency)}</span>
            </div>
            ${invoice.amount_paid > 0 ? `
              <div class="summary-row paid">
                <span>Amount Paid</span>
                <span class="font-mono">${formatCurrency(invoice.amount_paid, currency)}</span>
              </div>
              <div class="summary-row due ${balanceDue > 0 ? 'overdue-color' : 'paid-color'}">
                <span>Balance Due</span>
                <span class="font-mono">${formatCurrency(balanceDue, currency)}</span>
              </div>
            ` : ""}
          </div>
        </div>

        <!-- Bank details -->
        ${((bankAccount && (bankAccount.bank_name || bankAccount.account_name || bankAccount.account_number)) ||
          (org?.bank_name || org?.account_name || org?.account_number)) ? `
          <div class="section-block">
            <h4>Payment Details</h4>
            <div class="bank-grid">
              <div class="bank-col">
                <span class="title">Bank</span>
                <span class="val">${bankAccount ? bankAccount.bank_name : (org?.bank_name || "")}</span>
              </div>
              <div class="bank-col">
                <span class="title">Account Name</span>
                <span class="val">${bankAccount ? bankAccount.account_name : (org?.account_name || "")}</span>
              </div>
              <div class="bank-col">
                <span class="title">Account Number</span>
                <span class="val acc-num font-mono">${bankAccount ? bankAccount.account_number : (org?.account_number || "")}</span>
              </div>
              ${bankAccount?.routing_number ? `
                <div class="bank-col">
                  <span class="title">Routing No.</span>
                  <span class="val font-mono">${bankAccount.routing_number}</span>
                </div>
              ` : ""}
              ${bankAccount?.swift_code ? `
                <div class="bank-col">
                  <span class="title">SWIFT/BIC</span>
                  <span class="val font-mono">${bankAccount.swift_code}</span>
                </div>
              ` : ""}
            </div>
          </div>
        ` : ""}

        <!-- Terms -->
        ${org?.payment_terms ? `
          <div class="section-block">
            <h4>Terms & Conditions</h4>
            <p class="terms-p">${org.payment_terms}</p>
          </div>
        ` : ""}

        <!-- Custom Branding Footer -->
        ${org?.custom_footer ? `
          <div class="section-block" style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 20px;">
            <p style="font-size: 11px; color: #64748b; line-height: 1.5; margin: 0; white-space: pre-line;">${org.custom_footer}</p>
          </div>
        ` : ""}

        <!-- Notes -->
        ${invoice.notes ? `
          <div class="section-block">
            <h4>Notes</h4>
            <p class="notes-p">${invoice.notes}</p>
          </div>
        ` : ""}

      </div>
    </body>
    </html>
  `;

  // Initialize headless browser via Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(htmlString, { waitUntil: "load" });
  await page.evaluateHandle(() => document.fonts.ready);

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

  await browser.close();

  return Buffer.from(pdfBuffer);
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

    const pdfBuffer = await generatePDFBuffer(id, supabase);
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
