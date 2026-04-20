// "use client";

// import { useEffect, useState } from "react";
// import { createBrowserClient } from "@supabase/ssr";

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
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [orgId, setOrgId] = useState<string | null>(null);

//   const [form, setForm] = useState({
//     currency: "NGN",
//     invoice_prefix: "INV-",
//     payment_terms: "Due on receipt",
//     bank_name: "",
//     account_name: "",
//     account_number: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >,
//   ) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   useEffect(() => {
//     const supabase = createBrowserClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     );

//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);

//       const { data: userRes } = await supabase.auth.getUser();
//       const user = userRes?.user;
//       if (!user) {
//         setError("User not found");
//         setLoading(false);
//         return;
//       }

//       const { data: profile } = await supabase
//         .from("profiles")
//         .select("organization_id")
//         .eq("id", user.id)
//         .single();

//       if (!profile?.organization_id) {
//         setError("Organization not found");
//         setLoading(false);
//         return;
//       }

//       setOrgId(profile.organization_id);

//       const { data } = await supabase
//         .from("organizations")
//         .select("*")
//         .eq("id", profile.organization_id)
//         .single();

//       if (data) {
//         setForm({
//           currency: data.currency || "NGN",
//           invoice_prefix: data.invoice_prefix || "INV-",
//           payment_terms: data.payment_terms || "Due on receipt",
//           bank_name: data.bank_name || "",
//           account_name: data.account_name || "",
//           account_number: data.account_number || "",
//         });
//       }

//       setLoading(false);
//     };

//     fetchData();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!orgId) {
//       setError("Organization ID is missing");
//       return;
//     }

//     setSaving(true);
//     setError(null);
//     setSuccess(null);

//     const supabase = createBrowserClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     );

//     await supabase.from("organizations").update(form).eq("id", orgId);

//     setSaving(false);
//   };

//   if (loading) {
//     return <div className="bg-white p-6 rounded-2xl">Loading...</div>;
//   }

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-white p-6 rounded-2xl space-y-6"
//     >
//       <h2 className="text-lg font-semibold">Invoice Settings</h2>

//       <div className="grid md:grid-cols-2 gap-4">
//         <div className="flex flex-col gap-1">
//           <label htmlFor="currency">Default Currency</label>
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
//           <label htmlFor="invoice_prefix">Invoice Prefix</label>
//           <input
//             name="invoice_prefix"
//             value={form.invoice_prefix}
//             onChange={handleChange}
//             placeholder="Invoice Prefix"
//             className="border p-3 rounded-lg"
//           />
//         </div>
//       </div>

//       <div className="flex flex-col gap-1">
//         <label htmlFor="payment_terms">Payment Terms</label>
//         <textarea
//           name="payment_terms"
//           value={form.payment_terms}
//           onChange={handleChange}
//           placeholder="Payment Terms"
//           className="border p-3 rounded-lg w-full"
//         />
//       </div>

//       <h3 className="font-medium">Bank Details</h3>

//       <div className="grid md:grid-cols-2 gap-4">
//         <div className="flex flex-col gap-1">
//           <label htmlFor="bank_name">Bank Name</label>
//           <input
//             name="bank_name"
//             value={form.bank_name}
//             onChange={handleChange}
//             placeholder="Bank Name"
//             className="border p-3 rounded-lg"
//           />
//         </div>

//         <div className="flex flex-col gap-1">
//           <label htmlFor="account_name">Account Name</label>
//           <input
//             name="account_name"
//             value={form.account_name}
//             onChange={handleChange}
//             placeholder="Account Name"
//             className="border p-3 rounded-lg"
//           />
//         </div>

//         <div className="flex flex-col gap-1">
//           <label htmlFor="account_number">Account Number</label>
//           <input
//             name="account_number"
//             value={form.account_number}
//             onChange={handleChange}
//             placeholder="Account Number"
//             className="border p-3 rounded-lg"
//           />
//         </div>
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

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [orgId, setOrgId] = useState<string | null>(null);

  const [form, setForm] = useState({
    currency: "NGN",
    invoice_prefix: "INV-",
    payment_terms: "Due on receipt",
    bank_name: "",
    account_name: "",
    account_number: "",
  });

  // Optimized change handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch data (safe + structured)
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error("User not authenticated");
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", user.id)
          .single();

        if (profileError || !profile?.organization_id) {
          throw new Error("Organization not found");
        }

        if (!isMounted) return;
        setOrgId(profile.organization_id);

        const { data: org, error: orgError } = await supabase
          .from("organizations")
          .select(
            "currency, invoice_prefix, payment_terms, bank_name, account_name, account_number"
          )
          .eq("id", profile.organization_id)
          .single();

        if (orgError) throw orgError;

        if (org && isMounted) {
          setForm({
            currency: org.currency || "NGN",
            invoice_prefix: org.invoice_prefix || "INV-",
            payment_terms: org.payment_terms || "Due on receipt",
            bank_name: org.bank_name || "",
            account_name: org.account_name || "",
            account_number: org.account_number || "",
          });
        }
      } catch (err) {
        if (!isMounted) return;
        const message =
          err instanceof Error ? err.message : "Failed to load settings";
        setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  // Submit handler (robust)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orgId) {
      setError("Organization ID is missing");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from("organizations")
        .update(form)
        .eq("id", orgId);

      if (error) throw error;

      setSuccess("Invoice settings updated successfully!");

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Update failed";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        Loading...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white p-6 rounded-2xl shadow-sm space-y-6 relative"
    >
      <h2 className="text-lg font-semibold">Invoice Settings</h2>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {success && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
          {success}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label>Default Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          >
            <option value="">Select Currency</option>
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label>Invoice Prefix</label>
          <input
            name="invoice_prefix"
            value={form.invoice_prefix}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label>Payment Terms</label>
        <textarea
          name="payment_terms"
          value={form.payment_terms}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />
      </div>

      <h3 className="font-medium">Bank Details</h3>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          { name: "bank_name" as const, label: "Bank Name" },
          { name: "account_name" as const, label: "Account Name" },
          { name: "account_number" as const, label: "Account Number" },
        ].map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <label>{field.label}</label>
            <input
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-deepgreen text-white px-6 py-2 rounded-lg disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}