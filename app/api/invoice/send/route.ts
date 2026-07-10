import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generatePDFBuffer } from "../[id]/pdf/route";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { invoiceId, clientEmail, emailSubject, emailBody } = await req.json();

    if (!invoiceId || !clientEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpEmail || !smtpPassword) {
      return NextResponse.json(
        { error: "SMTP_EMAIL or SMTP_PASSWORD is not configured in environment variables. Please configure these to send emails." },
        { status: 500 }
      );
    }

    // 1. Fetch the invoice details to check access and get names
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*, customers(name), organizations(name)")
      .eq("id", invoiceId)
      .single() as any;

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // 2. Generate the PDF buffer directly in memory (avoids internal loopback HTTP fetches)
    const pdfBuffer = await generatePDFBuffer(invoiceId, supabase);

    // 3. Configure the Nodemailer SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    // 4. Configure email parameters
    const orgName = invoice.organizations?.name || "Invoxa";
    const mailOptions = {
      from: `"${orgName} via Invoxa" <${smtpEmail}>`,
      replyTo: smtpEmail,
      to: clientEmail,
      subject: emailSubject || `Invoice #${invoice.invoice_number || invoice.id.slice(0, 8)}`,
      text: emailBody, // Crucial plain text fallback to prevent spam flagging (multipart/alternative)
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #1f2937; margin-top: 0;">Invoice from ${orgName}</h2>
          <div style="margin-top: 20px; margin-bottom: 20px; font-size: 16px;">
            ${emailBody.replace(/\n/g, "<br />")}
          </div>
          <p style="font-size: 14px; color: #4b5563;">
            Please find your invoice attached as a PDF file.
          </p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-bottom: 0;">
            This email was sent securely on behalf of ${orgName} via Invoxa.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `invoice-${invoice.invoice_number || invoice.id.slice(0, 8)}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // 5. Send the mail
    await transporter.sendMail(mailOptions);

    // 6. Update the invoice status to 'sent' if it is currently 'draft'
    if (invoice.status === "draft") {
      const { error: updateError } = await (supabase
        .from("invoices")
        .update({ status: "sent" } as any) as any)
        .eq("id", invoiceId);

      if (updateError) {
        console.error("Failed to update invoice status to sent:", updateError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Send invoice failed:", error);
    return NextResponse.json({ error: error.message || "Failed to send invoice email" }, { status: 500 });
  }
}
