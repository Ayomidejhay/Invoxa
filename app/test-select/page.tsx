"use client";

import React, { useState } from "react";
import { Select } from "@/app/components/ui/Select";
import { Button } from "@/app/components/ui/Button";

export default function TestSelectPage() {
  const [customer, setCustomer] = useState("");
  const [role, setRole] = useState("staff");
  const [currency, setCurrency] = useState("USD");
  const [product, setProduct] = useState("");
  
  const [validationError, setValidationError] = useState<string | undefined>(undefined);
  const [darkMode, setDarkMode] = useState(false);

  const mockCustomers = [
    { id: "c1", name: "Aisha Bello" },
    { id: "c2", name: "John Smith" },
    { id: "c3", name: "Jane Doe" },
    { id: "c4", name: "Bob Johnson" },
    { id: "c5", name: "Emeka Okoye" },
    { id: "c6", name: "Sarah Williams" },
    { id: "c7", name: "Michael Chang" },
    { id: "c8", name: "Fatima Yusuf" },
    { id: "c9", name: "David Miller" },
    { id: "c10", name: "Linda Thompson" },
    { id: "c11", name: "Robert Taylor" },
    { id: "c12", name: "Grace Davis" },
  ];

  const mockCurrencies = [
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

  const handleValidation = () => {
    if (!customer) {
      setValidationError("Please select a customer");
    } else {
      setValidationError(undefined);
      alert(`Submitted! Customer: ${customer}, Role: ${role}, Currency: ${currency}`);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#070809] text-dark dark:text-white p-8 transition-colors duration-200">
        <div className="max-w-xl mx-auto space-y-8 bg-white dark:bg-[#0E0F12] border dark:border-zinc-800 rounded-2xl p-6 shadow-md">
          {/* Header */}
          <div className="flex items-center justify-between border-b dark:border-zinc-800 pb-4">
            <div>
              <h1 className="text-xl font-bold">Select Component Testing Sandbox</h1>
              <p className="text-xs text-zinc-500 mt-1">Verify custom dropdowns, search capability, and mobile modal simulation.</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 cursor-pointer"
            >
              Toggle {darkMode ? "Light" : "Dark"} Mode
            </button>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {/* 1. Large list with Search (Customer Select) */}
            <Select
              label="Customer (Searchable, > 8 options)"
              value={customer}
              onChange={(e) => {
                setCustomer(e.target.value);
                setValidationError(undefined);
              }}
              error={validationError}
            >
              <option value="">Select Customer</option>
              {mockCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>

            {/* 2. Small list (Role Select) */}
            <Select
              label="Role (Simple, 2 options)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </Select>

            {/* 3. Currency Select */}
            <Select
              label="Invoice Currency (Searchable)"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {mockCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.label}
                </option>
              ))}
            </Select>

            {/* 4. Disabled Select */}
            <Select
              label="Disabled Select"
              value={product}
              disabled
              onChange={(e) => setProduct(e.target.value)}
            >
              <option value="">No products available</option>
            </Select>
          </div>

          {/* Value Display */}
          <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-xl p-4 border dark:border-zinc-800 text-xs font-mono space-y-1">
            <h3 className="font-bold mb-2 text-zinc-500">Current State values:</h3>
            <div>customer: &quot;{customer}&quot;</div>
            <div>role: &quot;{role}&quot;</div>
            <div>currency: &quot;{currency}&quot;</div>
          </div>

          {/* Action button */}
          <div className="flex gap-3 justify-end border-t dark:border-zinc-800 pt-4">
            <Button variant="outline" onClick={() => { setCustomer(""); setRole("staff"); setCurrency("USD"); setValidationError(undefined); }}>
              Reset
            </Button>
            <Button onClick={handleValidation}>
              Validate & Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
