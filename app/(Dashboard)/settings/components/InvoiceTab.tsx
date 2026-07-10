

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

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useOrganization } from "../../components/OrganizationProvider";
import { Card } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { Select } from "@/app/components/ui/Select";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";
import { useToast } from "@/app/components/ui/Toast";
import type { BankAccount } from "@/lib/supabase/database.types";

const currencies = [
  { code: "NGN", label: "Nigerian Naira" },
  { code: "USD", label: "US Dollar" },
  { code: "EUR", label: "Euro" },
  { code: "GBP", label: "British Pound" },
  { code: "CAD", label: "Canadian Dollar" },
  { code: "AUD", label: "Australian Dollar" },
  { code: "JPY", label: "Japanese Yen" },
];

const colorPresets = [
  { name: "Emerald", hex: "#355834" },
  { name: "Charcoal", hex: "#1e293b" },
  { name: "Sapphire", hex: "#2563eb" },
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Amber", hex: "#b7791f" },
  { name: "Ruby", hex: "#b91c1c" },
];

export function InvoiceTab() {
  const supabase = getSupabaseClient();
  const router = useRouter();
  const { organization } = useOrganization();
  const toast = useToast();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Main Form Settings
  const [form, setForm] = useState({
    currency: organization.currency || "NGN",
    invoice_prefix: organization.invoice_prefix || "INV-",
    payment_terms: organization.payment_terms || "Due on receipt",
    bank_name: organization.bank_name || "",
    account_name: organization.account_name || "",
    account_number: organization.account_number || "",
    default_deposit_percentage: organization.default_deposit_percentage?.toString() || "",
    primary_color: organization.primary_color || "#355834",
    custom_footer: organization.custom_footer || "",
  });

  // Multi-Currency Bank Accounts State
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [addingAccount, setAddingAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    currency: "NGN",
    bank_name: "",
    account_name: "",
    account_number: "",
    routing_number: "",
    swift_code: "",
  });

  // Load Currency Bank Accounts
  const loadBankAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const { data, error } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("organization_id", organization.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setBankAccounts(data || []);
    } catch (err) {
      console.error("Failed to load bank accounts:", err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    loadBankAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewAccountChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handlePresetSelect = (hex: string) => {
    setForm((prev) => ({ ...prev, primary_color: hex }));
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

    // Hex Color Validation
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(form.primary_color)) {
      setError("Please specify a valid HEX color code (e.g. #355834)");
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
          primary_color: form.primary_color,
          custom_footer: form.custom_footer || null,
        })
        .eq("id", organization.id);

      if (error) throw error;

      toast.success("Invoice settings updated");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.bank_name.trim() || !newAccount.account_name.trim() || !newAccount.account_number.trim()) {
      toast.error("Please fill in all required bank fields");
      return;
    }

    setAddingAccount(true);
    try {
      const { error } = await supabase.from("bank_accounts").insert({
        organization_id: organization.id,
        currency: newAccount.currency,
        bank_name: newAccount.bank_name.trim(),
        account_name: newAccount.account_name.trim(),
        account_number: newAccount.account_number.trim(),
        routing_number: newAccount.routing_number.trim() || null,
        swift_code: newAccount.swift_code.trim() || null,
      });

      if (error) throw error;

      toast.success("Multi-currency bank account added!");
      setNewAccount({
        currency: "NGN",
        bank_name: "",
        account_name: "",
        account_number: "",
        routing_number: "",
        swift_code: "",
      });
      loadBankAccounts();
    } catch (err: any) {
      toast.error(err.message || "Failed to add bank account");
    } finally {
      setAddingAccount(false);
    }
  };

  const handleDeleteBankAccount = async (id: string) => {
    if (!confirm("Are you sure you want to remove this bank account?")) return;

    try {
      const { error } = await supabase.from("bank_accounts").delete().eq("id", id);
      if (error) throw error;
      toast.success("Bank account removed");
      loadBankAccounts();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete bank account");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. General & Branding Settings */}
      <Card className="space-y-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <h2 className="text-lg font-bold text-dark dark:text-white">Invoice Settings & Branding</h2>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Default Currency"
              name="currency"
              value={form.currency}
              onChange={handleChange}
            >
              <option value="" className="bg-white dark:bg-[#202023] text-dark dark:text-white">Select Currency</option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code} className="bg-white dark:bg-[#202023] text-dark dark:text-white">
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

          <div className="border-t border-slate-200 dark:border-zinc-800/80 pt-4">
            <h3 className="font-semibold text-dark dark:text-white text-sm mb-1">Part Payments</h3>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 mb-3">
              Suggested deposit when recording a customer&apos;s first payment on an invoice — prefilled, not enforced.
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
              className="max-w-xs"
            />
          </div>

          {/* BRANDING ACCENTS */}
          <div className="border-t border-slate-200 dark:border-zinc-800/80 pt-4 space-y-4">
            <h3 className="font-semibold text-dark dark:text-white text-sm">Invoice Branding</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">Accent Color Preset</label>
              <div className="flex flex-wrap gap-3 items-center">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => handlePresetSelect(preset.hex)}
                    style={{ backgroundColor: preset.hex }}
                    className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                      form.primary_color.toLowerCase() === preset.hex.toLowerCase()
                        ? "border-zinc-900 dark:border-white scale-110 shadow-md"
                        : "border-transparent hover:scale-105"
                    }`}
                    title={preset.name}
                  />
                ))}
                
                <div className="flex items-center gap-2 ml-4">
                  <Input
                    label="Custom Accent (HEX)"
                    name="primary_color"
                    value={form.primary_color}
                    onChange={handleChange}
                    placeholder="#355834"
                    className="max-w-[150px] !mb-0"
                  />
                  <div
                    style={{ backgroundColor: form.primary_color }}
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-zinc-800 self-end"
                  />
                </div>
              </div>
            </div>

            <Textarea
              label="Custom Invoice Footer (e.g. Payment Info or Terms)"
              name="custom_footer"
              value={form.custom_footer}
              onChange={handleChange}
              placeholder="e.g. Thank you for choosing Invoxa! For support, contact support@invoxa.com."
              hint="This footer text will appear at the very bottom of both on-screen and PDF invoices."
            />
          </div>

          {/* DEFAULT BANK DETAILS */}
          <div className="border-t border-slate-200 dark:border-zinc-800/80 pt-4">
            <h3 className="font-semibold text-dark dark:text-white text-sm mb-1">Default Bank Details</h3>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 mb-3">
              Fallback banking instructions displayed if no currency-specific bank accounts are found.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <Input label="Bank Name" name="bank_name" value={form.bank_name} onChange={handleChange} />
              <Input label="Account Name" name="account_name" value={form.account_name} onChange={handleChange} />
              <Input label="Account Number" name="account_number" value={form.account_number} onChange={handleChange} />
            </div>
          </div>

          <Button type="submit" loading={saving} className="font-semibold px-6 py-2.5">
            Save Brand & General Settings
          </Button>
        </form>
      </Card>

      {/* 2. Multi-Currency Bank Accounts Management */}
      <Card className="space-y-6">
        <h2 className="text-lg font-bold text-dark dark:text-white">Multi-Currency Bank Details</h2>
        <p className="text-xs text-zinc-550 dark:text-zinc-400">
          Configure designated bank accounts for different currencies. The invoice display will automatically pull the bank account matching the invoice currency.
        </p>

        {/* Existing Accounts List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-dark dark:text-white text-sm">Configured Accounts</h3>
          {loadingAccounts ? (
            <p className="text-xs text-zinc-500 animate-pulse">Loading accounts...</p>
          ) : bankAccounts.length === 0 ? (
            <div className="p-4 bg-slate-50 dark:bg-[#1e1e21] rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 text-center">
              <p className="text-xs text-zinc-550 dark:text-zinc-400">No currency bank accounts configured yet. Billing defaults to organization fallback bank details.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-850">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-zinc-800/80 text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#1a1a1c] text-zinc-500 dark:text-zinc-400 font-semibold uppercase">
                  <tr>
                    <th className="px-4 py-3">Currency</th>
                    <th className="px-4 py-3">Bank Name</th>
                    <th className="px-4 py-3">Account Details</th>
                    <th className="px-4 py-3">Routing / SWIFT</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/50">
                  {bankAccounts.map((acct) => (
                    <tr key={acct.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 text-dark dark:text-white">
                      <td className="px-4 py-3.5 font-bold font-mono text-indigo-500">{acct.currency}</td>
                      <td className="px-4 py-3.5">{acct.bank_name}</td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium">{acct.account_name}</div>
                        <div className="font-mono text-zinc-500 dark:text-zinc-400">{acct.account_number}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        {acct.routing_number && <div><span className="text-zinc-500">Route:</span> {acct.routing_number}</div>}
                        {acct.swift_code && <div><span className="text-zinc-500">SWIFT:</span> {acct.swift_code}</div>}
                        {!acct.routing_number && !acct.swift_code && <span className="text-zinc-400">-</span>}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteBankAccount(acct.id)}
                          className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md font-semibold cursor-pointer transition"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Account Form */}
        <div className="border-t border-slate-200 dark:border-zinc-800/80 pt-4">
          <h3 className="font-semibold text-dark dark:text-white text-sm mb-3">Add Custom Currency Bank</h3>
          <form onSubmit={handleAddBankAccount} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Select
                label="Currency"
                name="currency"
                value={newAccount.currency}
                onChange={handleNewAccountChange}
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code} className="bg-white dark:bg-[#202023]">
                    {c.code}
                  </option>
                ))}
              </Select>

              <Input
                label="Bank Name"
                name="bank_name"
                value={newAccount.bank_name}
                onChange={handleNewAccountChange}
                placeholder="e.g. Chase Bank"
                required
              />

              <Input
                label="Account Name"
                name="account_name"
                value={newAccount.account_name}
                onChange={handleNewAccountChange}
                placeholder="e.g. Invoxa Inc."
                required
              />

              <Input
                label="Account Number"
                name="account_number"
                value={newAccount.account_number}
                onChange={handleNewAccountChange}
                placeholder="e.g. 1234567890"
                required
              />

              <Input
                label="Routing Number (Optional)"
                name="routing_number"
                value={newAccount.routing_number}
                onChange={handleNewAccountChange}
                placeholder="e.g. 021000021"
              />

              <Input
                label="SWIFT / BIC Code (Optional)"
                name="swift_code"
                value={newAccount.swift_code}
                onChange={handleNewAccountChange}
                placeholder="e.g. CHASUS33"
              />
            </div>

            <Button type="submit" loading={addingAccount} className="px-4 py-2 bg-slate-900 dark:bg-zinc-800 text-white font-semibold">
              Add Bank Account
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

