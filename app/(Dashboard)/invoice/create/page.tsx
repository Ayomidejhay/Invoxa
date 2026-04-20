// 'use client'

// import { useEffect, useState } from 'react'
// import { createBrowserClient } from '@supabase/ssr'
// import { useRouter } from 'next/navigation'

// type Customer = {
//   id: string
//   name: string
// }

// type Product = {
//   id: string
//   name: string
//   sale_price: number | null
//   rental_price: number | null
// }

// type InvoiceItem = {
//   product_id: string
//   quantity: number
//   unit_price: number
//   start_date?: string
//   end_date?: string
// }

// export default function CreateInvoicePage() {
//   const router = useRouter()

//   const supabase = createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )

//   const [customers, setCustomers] = useState<Customer[]>([])
//   const [products, setProducts] = useState<Product[]>([])

//   const [loading, setLoading] = useState(false)

//   const [form, setForm] = useState({
//     customer_id: '',
//     type: 'sale',
//   })

//   const [items, setItems] = useState<InvoiceItem[]>([])

//   useEffect(() => {
//     const loadData = async () => {
//       const { data: c } = await supabase.from('customers').select('*')
//       const { data: p } = await supabase.from('products').select('*')

//       setCustomers(c || [])
//       setProducts(p || [])
//     }

//     loadData()
//   }, [])

//   const addItem = () => {
//     setItems([
//       ...items,
//       {
//         product_id: '',
//         quantity: 1,
//         unit_price: 0,
//         start_date: '',
//         end_date: '',
//       },
//     ])
//   }

// //   const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
// //     const updated = [...items]
// //     updated[index][field] = value

// //     const product = products.find((p) => p.id === updated[index].product_id)

// //     if (product) {
// //       updated[index].unit_price =
// //         form.type === 'sale'
// //           ? product.sale_price || 0
// //           : product.rental_price || 0
// //     }

// //     setItems(updated)
// //   }

// const updateItem = <K extends keyof InvoiceItem>(
//   index: number,
//   field: K,
//   value: InvoiceItem[K]
// ) => {
//   const updated = [...items]

//   updated[index][field] = value

//   const product = products.find(
//     (p) => p.id === updated[index].product_id
//   )

//   if (product) {
//     updated[index].unit_price =
//       form.type === 'sale'
//         ? product.sale_price || 0
//         : product.rental_price || 0
//   }

//   setItems(updated)
// }

//   const calculateTotal = () => {
//     return items.reduce((sum, item) => {
//       if (form.type === 'rental' && item.start_date && item.end_date) {
//         const days =
//           (new Date(item.end_date).getTime() -
//             new Date(item.start_date).getTime()) /
//           (1000 * 60 * 60 * 24)

//         return sum + days * item.unit_price * item.quantity
//       }

//       return sum + item.unit_price * item.quantity
//     }, 0)
//   }

// //   const handleSubmit = async () => {
// //     setLoading(true)

// //     const {
// //       data: { user },
// //     } = await supabase.auth.getUser()

// //     const { data: profile } = await supabase
// //       .from('profiles')
// //       .select('organization_id')
// //       .eq('id', user?.id)
// //       .single()

// //     const total = calculateTotal()

// //     const { data: invoice } = await supabase
// //       .from('invoices')
// //       .insert({
// //         organization_id: profile?.organization_id,
// //         customer_id: form.customer_id,
// //         type: form.type,
// //         total,
// //         subtotal: total,
// //       })
// //       .select()
// //       .single()

// //     for (const item of items) {
// //       await supabase.from('invoice_items').insert({
// //         invoice_id: invoice.id,
// //         product_id: item.product_id,
// //         quantity: item.quantity,
// //         unit_price: item.unit_price,
// //         total_price:
// //           form.type === 'rental'
// //             ? (new Date(item.end_date).getTime() -
// //                 new Date(item.start_date).getTime()) /
// //                 (1000 * 60 * 60 * 24) *
// //               item.unit_price *
// //               item.quantity
// //             : item.unit_price * item.quantity,
// //         start_date: item.start_date || null,
// //         end_date: item.end_date || null,
// //       })
// //     }

// //     setLoading(false)
// //     router.push('/dashboard/invoices')
// //   }

// const handleSubmit = async () => {
//   setLoading(true)

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   const { data: profile } = await supabase
//     .from('profiles')
//     .select('organization_id')
//     .eq('id', user?.id)
//     .single()

//   const total = calculateTotal()

//   const { data: invoice } = await supabase
//     .from('invoices')
//     .insert({
//       organization_id: profile?.organization_id,
//       customer_id: form.customer_id,
//       type: form.type,
//       total,
//       subtotal: total,
//     })
//     .select()
//     .single()

//   for (const item of items) {
//     let totalPrice = item.unit_price * item.quantity

//     // ✅ SAFE RENTAL CALCULATION
//     if (
//       form.type === 'rental' &&
//       item.start_date &&
//       item.end_date
//     ) {
//       const start = new Date(item.start_date)
//       const end = new Date(item.end_date)

//       const days =
//         (end.getTime() - start.getTime()) /
//         (1000 * 60 * 60 * 24)

//       totalPrice = days * item.unit_price * item.quantity
//     }

//     await supabase.from('invoice_items').insert({
//       invoice_id: invoice.id,
//       product_id: item.product_id,
//       quantity: item.quantity,
//       unit_price: item.unit_price,
//       total_price: totalPrice,
//       start_date: item.start_date || null,
//       end_date: item.end_date || null,
//     })
//   }

//   setLoading(false)
//   router.push('/invoice')
// }

//   return (
//     <div className="space-y-6">
//       <h1 className="text-xl font-semibold">Create Invoice</h1>

//       {/* Header */}
//       <div className="grid md:grid-cols-2 gap-4">
//         <select
//           value={form.customer_id}
//           onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
//           className="border p-3 rounded-lg"
//         >
//           <option value="">Select Customer</option>
//           {customers.map((c) => (
//             <option key={c.id} value={c.id}>
//               {c.name}
//             </option>
//           ))}
//         </select>

//         <select
//           value={form.type}
//           onChange={(e) => setForm({ ...form, type: e.target.value })}
//           className="border p-3 rounded-lg"
//         >
//           <option value="sale">Sale</option>
//           <option value="rental">Rental</option>
//         </select>
//       </div>

//       {/* Items */}
//       <div className="space-y-4">
//         {items.map((item, i) => (
//           <div key={i} className="grid md:grid-cols-5 gap-3">
//             <select
//               onChange={(e) => updateItem(i, 'product_id', e.target.value)}
//               className="border p-2 rounded"
//             >
//               <option>Select Product</option>
//               {products.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.name}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="number"
//               placeholder="Qty"
//               value={item.quantity}
//               onChange={(e) => updateItem(i, 'quantity', Number(e.target.value))}
//               className="border p-2 rounded"
//             />

//             <input
//               type="number"
//               value={item.unit_price}
//               readOnly
//               className="border p-2 rounded bg-gray-100"
//             />

//             {form.type === 'rental' && (
//               <>
//                 <input
//                   type="date"
//                   onChange={(e) => updateItem(i, 'start_date', e.target.value)}
//                   className="border p-2 rounded"
//                 />

//                 <input
//                   type="date"
//                   onChange={(e) => updateItem(i, 'end_date', e.target.value)}
//                   className="border p-2 rounded"
//                 />
//               </>
//             )}
//           </div>
//         ))}

//         <button
//           onClick={addItem}
//           className="bg-gray-200 px-4 py-2 rounded"
//         >
//           Add Item
//         </button>
//       </div>

//       {/* Total */}
//       <div className="text-right font-semibold">
//         Total: ₦{calculateTotal()}
//       </div>

//       <button
//         onClick={handleSubmit}
//         disabled={loading}
//         className="bg-deepgreen text-white px-6 py-2 rounded-lg"
//       >
//         {loading ? 'Creating...' : 'Create Invoice'}
//       </button>
//     </div>
//   )
// }

"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

type Customer = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  sale_price: number | null;
  rental_price: number | null;
};

type InvoiceItem = {
  product_id: string;
  quantity: number;
  unit_price: number;
};

export default function CreateInvoicePage() {
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState<InvoiceItem[]>([]);

  const [form, setForm] = useState({
    customer_id: "",
    type: "sale",
    start_date: "",
    end_date: "",
  });

  const [errors, setErrors] = useState<{
    customer?: string;
    items?: string;
    rental?: string;
    general?: string;
  }>({});

  useEffect(() => {
    const loadData = async () => {
      const { data: c } = await supabase.from("customers").select("*");
      const { data: p } = await supabase.from("products").select("*");

      setCustomers(c || []);
      setProducts(p || []);
    };

    loadData();
  }, []);

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: "",
        quantity: 1,
        unit_price: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const updateItem = <K extends keyof InvoiceItem>(
    index: number,
    field: K,
    value: InvoiceItem[K],
  ) => {
    const updated = [...items];
    updated[index][field] = value;

    const product = products.find((p) => p.id === updated[index].product_id);

    if (product) {
      updated[index].unit_price =
        form.type === "sale"
          ? product.sale_price || 0
          : product.rental_price || 0;
    }

    setItems(updated);
  };

  // ================= PER ITEM TOTAL =================
  const getItemTotal = (item: InvoiceItem) => {
    return item.unit_price * item.quantity;
  };

  const calculateTotal = () => {
    const base = items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0,
    );

    if (form.type === "rental") {
      if (!form.start_date || !form.end_date) return 0;

      const start = new Date(form.start_date);
      const end = new Date(form.end_date);

      const days = end.getTime() - start.getTime() + 1 / (1000 * 60 * 60 * 24);

      return base * days;
    }

    return base;
  };

  // ================= VALIDATION =================
  const validate = () => {
    const newErrors: typeof errors = {};

    if (!form.customer_id) {
      newErrors.customer = "Please select a customer";
    }

    if (items.length === 0) {
      newErrors.items = "Add at least one item";
    }

    if (items.some((i) => !i.product_id)) {
      newErrors.items = "All items must have a selected product";
    }

    if (form.type === "rental") {
      if (!form.start_date || !form.end_date) {
        newErrors.rental = "Start and end dates are required for rental";
      } else {
        const start = new Date(form.start_date);
        const end = new Date(form.end_date);

        if (end <= start) {
          newErrors.rental = "End date must be after start date";
        }
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user?.id)
        .single();

      const total = calculateTotal();

      //   const { data: invoice } = await supabase
      //     .from("invoices")
      //     .insert({
      //       organization_id: profile?.organization_id,
      //       customer_id: form.customer_id,
      //       type: form.type,
      //       total,
      //       subtotal: total,
      //       start_date: form.type === "rental" ? form.start_date : null,
      //       end_date: form.type === "rental" ? form.end_date : null,
      //     })
      //     .select()
      //     .single();
      const { data: invoice, error } = await supabase
        .from("invoices")
        .insert({
          organization_id: profile?.organization_id,
          customer_id: form.customer_id,
          type: form.type,
          total,
          subtotal: total,
          start_date: form.type === "rental" ? form.start_date : null,
          end_date: form.type === "rental" ? form.end_date : null,
        })
        .select()
        .single();

      console.log("INVOICE ERROR:", error);
      console.log("INVOICE DATA:", invoice);

      if (error || !invoice) {
        throw new Error(error?.message || "Invoice creation failed");
      }

      for (const item of items) {
        await supabase.from("invoice_items").insert({
          invoice_id: invoice.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.unit_price * item.quantity,
        });
      }

      router.push("/invoice");
    } catch (err) {
      console.error(err);
      setErrors({
        general: "Failed to create invoice. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Create Invoice</h1>

      {/* CUSTOMER + TYPE */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Customer Name</label>
            <select
              value={form.customer_id}
              onChange={(e) => {
                setForm({
                  ...form,
                  customer_id: e.target.value,
                });
                setErrors((p) => ({
                  ...p,
                  customer: undefined,
                }));
              }}
              className="border p-3 rounded-lg w-full"
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {errors.customer && (
            <p className="text-red-500 text-sm">{errors.customer}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Invoice Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border p-3 rounded-lg"
          >
            <option value="sale">Sale</option>
            <option value="rental">Rental</option>
          </select>
        </div>
      </div>

      {/* RENTAL DATES */}
      {form.type === "rental" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="start_date">Start Date</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  start_date: e.target.value,
                })
              }
              className="border p-3 rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="end_date">End Date</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  end_date: e.target.value,
                })
              }
              className="border p-3 rounded-lg"
            />
          </div>

          {errors.rental && (
            <p className="text-red-500 text-sm md:col-span-2">
              {errors.rental}
            </p>
          )}
        </div>
      )}

      {/* ITEMS */}
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="grid md:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="">Product</label>
              <select
                onChange={(e) => updateItem(i, "product_id", e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="">Quantity</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(i, "quantity", Number(e.target.value))
                }
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="">Unit Price</label>
              <input
                type="number"
                value={item.unit_price}
                readOnly
                className="border p-2 rounded bg-gray-100"
              />
            </div>
            {/* ITEM TOTAL */}
            <div className="flex flex-col gap-3">
              <label htmlFor="">Item Total</label>
              <div className="font-medium">₦{getItemTotal(item)}</div>
            </div>

            {/* REMOVE BUTTON */}
            <div>
              <button
                onClick={() => removeItem(i)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {errors.items && <p className="text-red-500 text-sm">{errors.items}</p>}

        <button onClick={addItem} className="bg-gray-200 px-4 py-2 rounded">
          Add Item
        </button>
      </div>

      {/* TOTAL */}
      <div className="text-right font-semibold">Total: ₦{calculateTotal()}</div>

      {errors.general && (
        <p className="text-red-500 text-right">{errors.general}</p>
      )}

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-deepgreen text-white px-6 py-2 rounded-lg"
      >
        {loading ? "Creating..." : "Create Invoice"}
      </button>
    </div>
  );
}
