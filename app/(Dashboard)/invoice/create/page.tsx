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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization.id]);

  const productById = (id: string) => products.find((p) => p.id === id);

  const rentalDays = () => {
    if (!form.start_date || !form.end_date) return 0;
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  // Client-side total is a *preview only* — create_invoice() on the server
  // recomputes this authoritatively from current product prices, so a
  // stale price here can never under/overcharge.
  const getItemTotal = (item: DraftItem) => {
    const product = productById(item.product_id);
    if (!product) return 0;
    if (form.type === "sale") {
      return (product.sale_price || 0) * item.quantity;
    }
    return (product.rental_price || 0) * item.quantity * rentalDays();
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
    });

    setLoading(false);

    if (error || !invoice) {
      // Surfaces server-side validation directly — e.g. "Insufficient stock
      // for Widget (have 2, need 5)" from the create_invoice() function.
      setSubmitError(error?.message || "Failed to create invoice");
      return;
    }

    router.push(`/invoice/${invoice.id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl bg-[#1E1E1E] text-white">
      <h1 className="text-xl font-bold text-white">Create Invoice</h1>

      {submitError && (
        <div className="rounded-xl bg-red-950/30 border border-red-900/50 px-4 py-3 text-sm text-red-400">
          {submitError}
        </div>
      )}

      <Card className="space-y-6 bg-[#202023] border border-zinc-800 p-6 rounded-2xl shadow-sm">
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
                  active && t === "sale" ? "border-blue-600 bg-blue-950/40 text-blue-400" : "",
                  active && t === "rental" ? "border-orange-500 bg-orange-950/40 text-orange-400" : "",
                  !active ? "border-zinc-800 text-zinc-400 hover:border-zinc-700 bg-transparent" : "",
                ].join(" ")}
              >
                {t === "sale" ? "Sale" : "Rental"}
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Customer"
            value={form.customer_id}
            onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
            error={errors.customer}
            className="bg-[#202023] border-zinc-800 text-white"
          >
            <option value="" className="bg-[#202023] text-white">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#202023] text-white">
                {c.name}
              </option>
            ))}
          </Select>

          <Input
            label="Due date (optional)"
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            className="bg-[#202023] border-zinc-800 text-white"
          />
        </div>

        {form.type === "rental" && (
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Start date"
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              className="bg-[#202023] border-zinc-800 text-white"
            />
            <Input
              label="End date"
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              className="bg-[#202023] border-zinc-800 text-white"
            />
            {errors.rental && <p className="text-red-400 text-sm md:col-span-2">{errors.rental}</p>}
          </div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-200">Items</label>
          {items.map((item, i) => {
            const product = productById(item.product_id);
            const unitPrice = product ? (form.type === "sale" ? product.sale_price : product.rental_price) : null;

            return (
              <div key={i} className="grid md:grid-cols-5 gap-3 items-center border-b border-zinc-800/30 pb-3 last:border-b-0 last:pb-0">
                <Select
                  value={item.product_id}
                  onChange={(e) => updateItem(i, "product_id", e.target.value)}
                  className="md:col-span-2 bg-[#202023] border-zinc-800 text-white"
                >
                  <option value="" className="bg-[#202023] text-white">Select product</option>
                  {products.map((p) => (
                    <option
                      key={p.id}
                      value={p.id}
                      disabled={form.type === "sale" ? p.sale_price == null : p.rental_price == null}
                      className="bg-[#202023] text-white"
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
                  className="bg-[#202023] border-zinc-800 text-white"
                />

                <div className="text-sm text-zinc-400 font-mono">{unitPrice != null ? `${formatCurrency(unitPrice, organization.currency)}/unit` : "—"}</div>

                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white">{formatCurrency(getItemTotal(item), organization.currency)}</span>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300 text-sm cursor-pointer transition-colors">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {errors.items && <p className="text-red-400 text-sm">{errors.items}</p>}

          <button onClick={addItem} className="text-blue-400 hover:text-blue-300 text-sm font-semibold cursor-pointer transition-colors">
            + Add another item
          </button>
        </div>

        <Textarea
          label="Notes (optional)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="bg-[#202023] border-zinc-800 text-white"
        />

        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <span className="text-sm text-zinc-400">Total</span>
          <span className="text-2xl font-bold font-mono text-white">{formatCurrency(calculateTotal(), organization.currency)}</span>
        </div>

        <Button onClick={handleSubmit} loading={loading} fullWidth size="lg" className="bg-[#1E3A8A] text-white border border-blue-700/50 hover:bg-blue-700 font-semibold py-3 transition-colors">
          Create Invoice
        </Button>
      </Card>
    </div>
  );
}
