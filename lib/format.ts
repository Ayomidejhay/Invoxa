/**
 * Centralized currency formatting. Using this instead of a hardcoded ₦
 * literal means a tenant on USD/EUR/etc. (see Settings > Invoice Settings)
 * actually sees their own currency everywhere — invoices, lists, dashboard.
 *
 * `forCanvas` switches to a plain currency *code* ("NGN 400.00" instead of
 * "₦400.00"). html2canvas manually rasterizes text and miscalculates glyph
 * width for symbols like ₦ that aren't in most fonts' standard metrics
 * table, causing visible character overlap in exported PDFs. Falling back
 * to the ISO code for anything that goes through html2canvas sidesteps the
 * bug entirely without touching on-screen rendering (which renders fine —
 * browsers handle the glyph correctly; html2canvas's own text rasterizer
 * doesn't).
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = "NGN",
  options: { forCanvas?: boolean } = {}
): string {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: options.forCanvas ? "code" : "symbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Unknown/invalid currency code — fall back to a plain numeric format
    // rather than letting Intl throw and break the whole page.
    return `${currencyCode} ${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}
