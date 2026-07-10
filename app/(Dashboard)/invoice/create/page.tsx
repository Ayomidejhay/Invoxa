"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useOrganization } from "../../components/OrganizationProvider";
import type { Customer, Product, InvoiceType } from "@/lib/supabase/database.types";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Textarea } from "@/app/components/ui/Textarea";
import { Card } from "@/app/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import { FiArrowLeft, FiCpu } from "react-icons/fi";
import { getExchangeRates } from "@/lib/currency";
import ReceiptParserModal from "./components/ReceiptParserModal";

type DraftItem = {
  product_id: string;
  quantity: number;
};

export default function CreateInvoicePage() {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const { organization } = useOrganization();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [items, setItems] = useState<DraftItem[]>([{ product_id: "", quantity: 1 }]);

  const [form, setForm] = useState({
    customer_id: "",
    type: "sale" as InvoiceType,
    start_date: "",
    end_date: "",
    due_date: "",
    notes: "",
  });

  const [errors, setErrors] = useState<{ customer?: string; items?: string; rental?: string }>({});
  const [isParserOpen, setIsParserOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [{ data: c }, { data: p }] = await Promise.all([
        supabase.from("customers").select("*").eq("organization_id", organization.id).order("name"),
        supabase.from("products").select("*").eq("organization_id", organization.id).order("name"),
      ]);
      setCustomers(c || []);
      setProducts(p || []);
    };
    loadData();
  }, [organization.id]);

  const currencies = [
    { code: "NGN", label: "Nigerian Naira (₦)" },
    { code: "USD", label: "US Dollar ($)" },
    { code: "EUR", label: "Euro (€)" },
    { code: "GBP", label: "British Pound (£)" },
    { code: "CAD", label: "Canadian Dollar (CA$)" },
    { code: "AUD", label: "Australian Dollar (A$)" },
    { code: "GHS", label: "Ghanaian Cedi (₵)" },
    { code: "KES", label: "Kenyan Shilling (KSh)" },
    { code: "ZAR", label: "South African Rand (R)" },
  ];

  const [invoiceCurrency, setInvoiceCurrency] = useState("NGN");
  const [rates, setRates] = useState<Record<string, number>>({});

  useEffect(() => {
    if (organization.currency) {
      setInvoiceCurrency(organization.currency);
    }
  }, [organization.currency]);

  useEffect(() => {
    const fetchRates = async () => {
      const base = organization.currency || "NGN";
      const ratesData = await getExchangeRates(base);
      setRates(ratesData);
    };
    fetchRates();
  }, [organization.currency]);

  const getConversionFactor = () => {
    const base = (organization.currency || "NGN").toUpperCase();
    const target = invoiceCurrency.toUpperCase();
    if (base === target) return 1.0;
    return rates[target] || 1.0;
  };

  const getConvertedPrice = (basePrice: number) => {
    const factor = getConversionFactor();
    return Math.round(basePrice * factor * 100) / 100;
  };

  const productById = (id: string) => products.find((p) => p.id === id);

  const rentalDays = () => {
    if (!form.start_date || !form.end_date) return 0;
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const getItemTotal = (item: DraftItem) => {
    const product = productById(item.product_id);
    if (!product) return 0;
    const basePrice = form.type === "sale" ? (product.sale_price || 0) : (product.rental_price || 0);
    const convertedPrice = getConvertedPrice(basePrice);
    if (form.type === "sale") {
      return convertedPrice * item.quantity;
    }
    return convertedPrice * item.quantity * rentalDays();
  };

  const calculateTotal = () => items.reduce((sum, item) => sum + getItemTotal(item), 0);

  const addItem = () => setItems([...items, { product_id: "", quantity: 1 }]);

  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const updateItem = (index: number, field: keyof DraftItem, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!form.customer_id) newErrors.customer = "Please select a customer";

    const validItems = items.filter((i) => i.product_id);
    if (validItems.length === 0) newErrors.items = "Add at least one item";

    if (form.type === "rental") {
      if (!form.start_date || !form.end_date) {
        newErrors.rental = "Start and end dates are required";
      } else if (new Date(form.end_date) < new Date(form.start_date)) {
        newErrors.rental = "End date must be on or after the start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    if (!validate()) return;

    setLoading(true);

    const { data: invoice, error } = await supabase.rpc("create_invoice", {
      p_customer_id: form.customer_id,
      p_type: form.type,
      p_items: items
        .filter((i) => i.product_id)
        .map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      p_start_date: form.type === "rental" ? form.start_date : null,
      p_end_date: form.type === "rental" ? form.end_date : null,
      p_due_date: form.due_date || null,
      p_notes: form.notes || null,
      p_currency: invoiceCurrency,
      p_conversion_factor: getConversionFactor(),
    });

    setLoading(false);

    if (error || !invoice) {
      setSubmitError(error?.message || "Failed to create invoice");
      return;
    }

    router.push(`/invoice/${invoice.id}`);
  };

  const handleParseComplete = (data: any) => {
    const customerId = data.matchedCustomerId || "";
    const type = data.type || "sale";
    const dueDate = data.dueDate || "";
    const notes = data.notes || "";

    setForm((prev) => ({
      ...prev,
      customer_id: customerId,
      type: type as any,
      due_date: dueDate,
      notes: notes,
    }));

    if (data.items && Array.isArray(data.items)) {
      const mappedItems = data.items.map((item: any) => {
        return {
          product_id: item.matchedProductId || "",
          quantity: item.quantity || 1,
        };
      });
      setItems(mappedItems.length > 0 ? mappedItems : [{ product_id: "", quantity: 1 }]);
    }
  };

  return (
    <div className="space-y-6 w-full text-dark dark:text-white">
      <div className="flex items-center gap-2.5 mb-2">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0E0F12] text-zinc-500 hover:text-dark dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Back"
        >
          <FiArrowLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-zinc-550 dark:text-zinc-400">Back to invoices</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-dark dark:text-white">Create Invoice</h1>
        <Button
          onClick={() => setIsParserOpen(true)}
          variant="outline"
          className="font-semibold px-4 py-2 flex items-center gap-1.5 border-[#355834] text-[#355834] dark:border-green-800 dark:text-green-400 hover:bg-[#355834]/5 transition-colors cursor-pointer"
        >
          <FiCpu className="w-4 h-4 animate-pulse text-green-600 dark:text-green-400" />
          <span>AI Scan Receipt</span>
        </Button>
      </div>

      {submitError && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {submitError}
        </div>
      )}

      <Card className="space-y-6">
        {/* Sale / Rental — Toggle */}
        <div className="flex gap-3">
          {(["sale", "rental"] as const).map((t) => {
            const active = form.type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t })}
                className={[
                  "flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer text-center",
                  active && t === "sale" ? "border-[#355834] bg-[#355834]/10 text-[#355834] dark:text-[#8BB174] dark:bg-[#1C2C22]" : "",
                  active && t === "rental" ? "border-amber-600 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400" : "",
                  !active ? "border-slate-200 dark:border-zinc-800 text-zinc-550 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700 bg-transparent" : "",
                ].join(" ")}
              >
                {t === "sale" ? "Sale" : "Rental"}
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Select
            label="Customer"
            value={form.customer_id}
            onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
            error={errors.customer}
          >
            <option value="" className="bg-white dark:bg-[#202023] text-dark dark:text-white">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id} className="bg-white dark:bg-[#202023] text-dark dark:text-white">
                {c.name}
              </option>
            ))}
          </Select>

          <Input
            label="Due date (optional)"
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          />

          <Select
            label="Invoice Currency"
            value={invoiceCurrency}
            onChange={(e) => setInvoiceCurrency(e.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code} className="bg-white dark:bg-[#202023] text-dark dark:text-white">
                {currency.code} - {currency.label}
              </option>
            ))}
          </Select>
        </div>

        {form.type === "rental" && (
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Start date"
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            />
            <Input
              label="End date"
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            />
            {errors.rental && <p className="text-red-600 dark:text-red-400 text-sm md:col-span-2">{errors.rental}</p>}
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-750 dark:text-zinc-200">Items</label>
          {items.map((item, i) => {
            const product = productById(item.product_id);
            const basePrice = product ? (form.type === "sale" ? product.sale_price : product.rental_price) : null;
            const unitPrice = basePrice != null ? getConvertedPrice(basePrice) : null;

            return (
              <div key={i} className="grid md:grid-cols-5 gap-3 items-center border-b border-slate-200 dark:border-zinc-800/30 pb-3 last:border-b-0 last:pb-0">
                <Select
                  value={item.product_id}
                  onChange={(e) => updateItem(i, "product_id", e.target.value)}
                  className="md:col-span-2"
                >
                  <option value="" className="bg-white dark:bg-[#202023] text-dark dark:text-white">Select product</option>
                  {products.map((p) => (
                    <option
                      key={p.id}
                      value={p.id}
                      disabled={form.type === "sale" ? p.sale_price == null : p.rental_price == null}
                      className="bg-white dark:bg-[#202023] text-dark dark:text-white"
                    >
                      {p.name} {form.type === "sale" && p.stock <= 0 ? "(out of stock)" : ""}
                    </option>
                  ))}
                </Select>

                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
                />

                <div className="text-sm text-zinc-550 dark:text-zinc-400 font-mono">{unitPrice != null ? `${formatCurrency(unitPrice, invoiceCurrency)}/unit` : "—"}</div>

                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-dark dark:text-white">{formatCurrency(getItemTotal(item), invoiceCurrency)}</span>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-sm cursor-pointer transition-colors">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {errors.items && <p className="text-red-650 dark:text-red-400 text-sm">{errors.items}</p>}

          <button onClick={addItem} className="text-[#355834] dark:text-[#8BB174] hover:text-emerald-700 text-sm font-semibold cursor-pointer transition-colors">
            + Add another item
          </button>
        </div>

        <Textarea
          label="Notes (optional)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-zinc-800">
          <span className="text-sm text-zinc-550 dark:text-zinc-400 font-medium">Total</span>
          <span className="text-2xl font-bold font-mono text-dark dark:text-white">{formatCurrency(calculateTotal(), invoiceCurrency)}</span>
        </div>

        <Button onClick={handleSubmit} loading={loading} fullWidth size="lg" className="py-3 transition-colors">
          Create Invoice
        </Button>
      </Card>

      <ReceiptParserModal
        open={isParserOpen}
        onClose={() => setIsParserOpen(false)}
        onParseComplete={handleParseComplete}
      />
    </div>
  );
}
