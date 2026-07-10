type ExchangeRatesCache = {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
};

/**
 * Fetches exchange rates relative to the organization's base currency code.
 * Cache is stored inside localStorage for 1 hour to prevent rate limits.
 */
export async function getExchangeRates(baseCurrency: string): Promise<Record<string, number>> {
  const normalizedBase = baseCurrency.toUpperCase();
  const cacheKey = `rates_${normalizedBase}`;

  // If client-side browser, check cache first
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const data: ExchangeRatesCache = JSON.parse(cached);
        // Cache is valid for 1 hour (3,600,000 milliseconds)
        if (Date.now() - data.timestamp < 3600000) {
          return data.rates;
        }
      } catch (err) {
        console.warn("Failed to parse cached exchange rates:", err);
      }
    }
  }

  // Fetch from the free, no-auth Open ExchangeRate public API endpoint
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${normalizedBase}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.result === "success" && data.rates) {
      if (typeof window !== "undefined") {
        const cacheData: ExchangeRatesCache = {
          base: normalizedBase,
          rates: data.rates,
          timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      }
      return data.rates;
    }
  } catch (error) {
    console.error(`Failed to fetch exchange rates for ${normalizedBase}:`, error);
  }

  // Fallback return if offline or request fails
  return { [normalizedBase]: 1 };
}

/**
 * Converts a numeric value from the invoice currency into the target base currency.
 * Using the exchange rate dictionary.
 */
export function convertAmount(
  amount: number,
  fromCurrency: string | null | undefined,
  toCurrency: string | null | undefined,
  rates: Record<string, number>
): number {
  const from = (fromCurrency || "NGN").toUpperCase();
  const to = (toCurrency || "NGN").toUpperCase();

  if (from === to) return amount;

  // The retrieved rates represent how much of 'X' currency equals 1 unit of base 'toCurrency'.
  // Thus: Converted Base Amount = Amount / rateOfFromCurrency
  const rate = rates[from];
  if (rate && rate > 0) {
    return amount / rate;
  }

  // Fallback to original value if rate isn't available
  return amount;
}
