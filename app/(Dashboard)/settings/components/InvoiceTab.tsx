

// "use client";

// import { useState } from "react";
// import { getSupabaseClient } from "@/lib/supabase/client";
// import { useOrganization } from "../../components/OrganizationProvider";
// import { Card } from "@/app/components/ui/Card";
// import { Input } from "@/app/components/ui/Input";
// import { Select } from "@/app/components/ui/Select";
// import { Textarea } from "@/app/components/ui/Textarea";
// import { Button } from "@/app/components/ui/Button";
// import { useToast } from "@/app/components/ui/Toast";

// const currencies = [
//   { code: "NGN", label: "Nigerian Naira" },
//   { code: "USD", label: "US Dollar" },
//   { code: "EUR", label: "Euro" },
//   { code: "GBP", label: "British Pound" },
//   { code: "CAD", label: "Canadian Dollar" },
//   { code: "AUD", label: "Australian Dollar" },
//   { code: "JPY", label: "Japanese Yen" },
// ];

// export function InvoiceTab() {
//   const supabase = getSupabaseClient();
//   const { organization } = useOrganization();
//   const toast = useToast();

//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [form, setForm] = useState({
//     currency: organization.currency || "NGN",
//     invoice_prefix: organization.invoice_prefix || "INV-",
//     payment_terms: organization.payment_terms || "Due on receipt",
//     bank_name: organization.bank_name || "",
//     account_name: organization.account_name || "",
//     account_number: organization.account_number || "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setSaving(true);
//     setError(null);

//     try {
//       const { error } = await supabase
//         .from("organizations")
//         .update(form)
//         .eq("id", organization.id);

//       if (error) throw error;

//       toast.success("Invoice settings updated");
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Update failed";
//       setError(message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <Card className="space-y-6">
//       <form onSubmit={handleSubmit} noValidate className="space-y-6">
//         <h2 className="text-lg font-semibold text-dark">Invoice Settings</h2>

//         {error && <p className="text-sm text-red-600">{error}</p>}

//         <div className="grid md:grid-cols-2 gap-4">
//           <Select label="Default Currency" name="currency" value={form.currency} onChange={handleChange}>
//             <option value="">Select Currency</option>
//             {currencies.map((currency) => (
//               <option key={currency.code} value={currency.code}>
//                 {currency.code} - {currency.label}
//               </option>
//             ))}
//           </Select>

//           <Input label="Invoice Prefix" name="invoice_prefix" value={form.invoice_prefix} onChange={handleChange} />
//         </div>

//         <Textarea
//           label="Payment Terms"
//           name="payment_terms"
//           value={form.payment_terms}
//           onChange={handleChange}
//         />

//         <h3 className="font-medium text-dark text-sm">Bank Details</h3>

//         <div className="grid md:grid-cols-2 gap-4">
//           <Input label="Bank Name" name="bank_name" value={form.bank_name} onChange={handleChange} />
//           <Input label="Account Name" name="account_name" value={form.account_name} onChange={handleChange} />
//           <Input label="Account Number" name="account_number" value={form.account_number} onChange={handleChange} />
//         </div>

//         <Button type="submit" loading={saving}>
//           Save Settings
//         </Button>
//       </form>
//     </Card>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useOrganization } from "../../components/OrganizationProvider";
import { Card } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";
import { useToast } from "@/app/components/ui/Toast";

const currencies = [
  { code: "NGN", label: "Nigerian Naira" },
  { code: "USD", label: "US Dollar" },
  { code: "EUR", label: "Euro" },
  { code: "GBP", label: "British Pound" },
  { code: "CAD", label: "Canadian Dollar" },
  { code: "AUD", label: "Australian Dollar" },
  { code: "JPY", label: "Japanese Yen" },
];

export function InvoiceTab() {
  const supabase = getSupabaseClient();
  const router = useRouter();
  const { organization } = useOrganization();
  const toast = useToast();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    currency: organization.currency || "NGN",
    invoice_prefix: organization.invoice_prefix || "INV-",
    payment_terms: organization.payment_terms || "Due on receipt",
    bank_name: organization.bank_name || "",
    account_name: organization.account_name || "",
    account_number: organization.account_number || "",
    default_deposit_percentage: organization.default_deposit_percentage?.toString() || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError(null);

    const depositPct = form.default_deposit_percentage.trim();
    if (depositPct && (Number(depositPct) < 0 || Number(depositPct) > 100 || Number.isNaN(Number(depositPct)))) {
      setError("Deposit percentage must be a number between 0 and 100");
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("organizations")
        .update({
          currency: form.currency,
          invoice_prefix: form.invoice_prefix,
          payment_terms: form.payment_terms,
          bank_name: form.bank_name,
          account_name: form.account_name,
          account_number: form.account_number,
          default_deposit_percentage: depositPct ? Number(depositPct) : null,
        })
        .eq("id", organization.id);

      if (error) throw error;

      toast.success("Invoice settings updated");
      // The organization shown everywhere else in the app (dashboard, lists,
      // invoice creation) comes from the (Dashboard) layout's Server
      // Component fetch, cached in OrganizationProvider — without this, a
      // currency/setting change here wouldn't show up anywhere else until a
      // hard reload.
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="space-y-6">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <h2 className="text-lg font-bold text-white">Invoice Settings</h2>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Default Currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="bg-[#202023] border-zinc-800 text-white"
          >
            <option value="" className="bg-[#202023] text-white">Select Currency</option>
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code} className="bg-[#202023] text-white">
                {currency.code} - {currency.label}
              </option>
            ))}
          </Select>

          <Input label="Invoice Prefix" name="invoice_prefix" value={form.invoice_prefix} onChange={handleChange} className="bg-[#202023] border-zinc-800 text-white" />
        </div>

        <Textarea
          label="Payment Terms"
          name="payment_terms"
          value={form.payment_terms}
          onChange={handleChange}
          className="bg-[#202023] border-zinc-800 text-white"
        />

        <div className="border-t border-zinc-800/80 pt-4">
          <h3 className="font-semibold text-white text-sm mb-1">Part Payments</h3>
          <p className="text-xs text-zinc-400 mb-3">
            Suggested deposit when recording a customer&apos;s first payment on an invoice — shown as a
            prefilled amount, not enforced. Staff can still record any amount.
          </p>
          <Input
            label="Default deposit percentage"
            name="default_deposit_percentage"
            type="number"
            min="0"
            max="100"
            step="1"
            placeholder="e.g. 50"
            value={form.default_deposit_percentage}
            onChange={handleChange}
            hint="Leave blank to default to the full balance"
            className="max-w-xs bg-[#202023] border-zinc-800 text-white"
          />
        </div>

        <div className="border-t border-zinc-800/80 pt-4">
          <h3 className="font-semibold text-white text-sm mb-3">Bank Details</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Bank Name" name="bank_name" value={form.bank_name} onChange={handleChange} className="bg-[#202023] border-zinc-800 text-white" />
            <Input label="Account Name" name="account_name" value={form.account_name} onChange={handleChange} className="bg-[#202023] border-zinc-800 text-white" />
            <Input label="Account Number" name="account_number" value={form.account_number} onChange={handleChange} className="bg-[#202023] border-zinc-800 text-white" />
          </div>
        </div>

        <Button type="submit" loading={saving} className="bg-[#1E3A8A] text-white border border-blue-700/50 hover:bg-blue-700 font-semibold px-6 py-2.5">
          Save Settings
        </Button>
      </form>
    </Card>
  );
}
