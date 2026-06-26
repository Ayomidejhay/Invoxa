

// "use client";

// import { useState } from "react";
// import { getSupabaseClient } from "@/lib/supabase/client";
// import { useOrganization } from "../../components/OrganizationProvider";

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

//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

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
//     setSuccess(null);

//     try {
//       const { error } = await supabase
//         .from("organizations")
//         .update(form)
//         .eq("id", organization.id);

//       if (error) throw error;

//       setSuccess("Invoice settings updated successfully!");
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Update failed";
//       setError(message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       noValidate
//       className="bg-white p-6 rounded-2xl shadow-sm space-y-6 relative"
//     >
//       <h2 className="text-lg font-semibold">Invoice Settings</h2>

//       {error && <p className="text-sm text-red-500">{error}</p>}

//       {success && (
//         <div className="absolute top-2 right-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
//           {success}
//         </div>
//       )}

//       <div className="grid md:grid-cols-2 gap-4">
//         <div className="flex flex-col gap-1">
//           <label>Default Currency</label>
//           <select
//             name="currency"
//             value={form.currency}
//             onChange={handleChange}
//             className="border p-3 rounded-lg"
//           >
//             <option value="">Select Currency</option>
//             {currencies.map((currency) => (
//               <option key={currency.code} value={currency.code}>
//                 {currency.code} - {currency.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex flex-col gap-1">
//           <label>Invoice Prefix</label>
//           <input
//             name="invoice_prefix"
//             value={form.invoice_prefix}
//             onChange={handleChange}
//             className="border p-3 rounded-lg"
//           />
//         </div>
//       </div>

//       <div className="flex flex-col gap-1">
//         <label>Payment Terms</label>
//         <textarea
//           name="payment_terms"
//           value={form.payment_terms}
//           onChange={handleChange}
//           className="border p-3 rounded-lg w-full"
//         />
//       </div>

//       <h3 className="font-medium">Bank Details</h3>

//       <div className="grid md:grid-cols-2 gap-4">
//         {[
//           { name: "bank_name" as const, label: "Bank Name" },
//           { name: "account_name" as const, label: "Account Name" },
//           { name: "account_number" as const, label: "Account Number" },
//         ].map((field) => (
//           <div key={field.name} className="flex flex-col gap-1">
//             <label>{field.label}</label>
//             <input
//               name={field.name}
//               value={form[field.name]}
//               onChange={handleChange}
//               className="border p-3 rounded-lg"
//             />
//           </div>
//         ))}
//       </div>

//       <button
//         type="submit"
//         disabled={saving}
//         className="bg-deepgreen text-white px-6 py-2 rounded-lg disabled:opacity-50"
//       >
//         {saving ? "Saving..." : "Save Settings"}
//       </button>
//     </form>
//   );
// }

"use client";

import { useState } from "react";
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

    try {
      const { error } = await supabase
        .from("organizations")
        .update(form)
        .eq("id", organization.id);

      if (error) throw error;

      toast.success("Invoice settings updated");
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
        <h2 className="text-lg font-semibold text-dark">Invoice Settings</h2>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="grid md:grid-cols-2 gap-4">
          <Select label="Default Currency" name="currency" value={form.currency} onChange={handleChange}>
            <option value="">Select Currency</option>
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.label}
              </option>
            ))}
          </Select>

          <Input label="Invoice Prefix" name="invoice_prefix" value={form.invoice_prefix} onChange={handleChange} />
        </div>

        <Textarea
          label="Payment Terms"
          name="payment_terms"
          value={form.payment_terms}
          onChange={handleChange}
        />

        <h3 className="font-medium text-dark text-sm">Bank Details</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Bank Name" name="bank_name" value={form.bank_name} onChange={handleChange} />
          <Input label="Account Name" name="account_name" value={form.account_name} onChange={handleChange} />
          <Input label="Account Number" name="account_number" value={form.account_number} onChange={handleChange} />
        </div>

        <Button type="submit" loading={saving}>
          Save Settings
        </Button>
      </form>
    </Card>
  );
}
