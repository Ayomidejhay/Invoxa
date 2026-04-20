// 'use client'

// import { useEffect, useState } from 'react'
// import { createBrowserClient } from '@supabase/ssr'
// import { useRouter } from 'next/navigation'

// const page = () => {
//    const router = useRouter()

//   const supabase = createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )

//   const [invoices, setInvoices] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     let isMounted = true

//     const loadInvoices = async () => {
//       setLoading(true)

//       const { data, error } = await supabase
//         .from('invoices')
//         .select('*, customers(name)')
//         .order('created_at', { ascending: false })

//       if (isMounted && !error) {
//         setInvoices(data || [])
//         setLoading(false)
//       }
//     }

//     loadInvoices()

//     return () => {
//       isMounted = false
//     }
//   }, [])

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'paid':
//         return 'bg-green-100 text-green-700'
//       case 'sent':
//         return 'bg-yellow-100 text-yellow-700'
//       default:
//         return 'bg-gray-100 text-gray-600'
//     }
//   }
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold">Invoices</h1>

//         <button
//           onClick={() => router.push('/dashboard/invoices/create')}
//           className="bg-primary text-white px-4 py-2 rounded-lg"
//         >
//           Create Invoice
//         </button>
//       </div>

//       {/* Content */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : invoices.length === 0 ? (
//         <div className="flex flex-col items-center py-20 text-gray-500">
//           <p className="text-lg">No invoices yet</p>
//           <p className="text-sm">Create your first invoice</p>
//         </div>
//       ) : (
//         <div className="bg-white border rounded-xl overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="p-3 text-left">Invoice #</th>
//                 <th className="p-3 text-left">Customer</th>
//                 <th className="p-3 text-left">Type</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Total</th>
//                 <th className="p-3 text-left">Date</th>
//               </tr>
//             </thead>

//             <tbody>
//               {invoices.map((inv) => (
//                 <tr
//                   key={inv.id}
//                   className="border-t cursor-pointer hover:bg-gray-50"
//                   onClick={() => router.push(`/dashboard/invoices/${inv.id}`)}
//                 >
//                   <td className="p-3">{inv.invoice_number}</td>
//                   <td className="p-3">{inv.customers?.name}</td>
//                   <td className="p-3 capitalize">{inv.type}</td>

//                   <td className="p-3">
//                     <span
//                       className={`px-2 py-1 rounded text-xs ${getStatusColor(
//                         inv.status
//                       )}`}
//                     >
//                       {inv.status}
//                     </span>
//                   </td>

//                   <td className="p-3">₦{inv.total}</td>
//                   <td className="p-3">
//                     {new Date(inv.created_at).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   )
// }

// export default page




'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

type Invoice = {
  id: string
  invoice_number: string
  type: 'sale' | 'rental'
  status: 'draft' | 'sent' | 'paid'
  total: number
  created_at: string

  customers?: {
    name: string
  }
}

export default function InvoicePage() {
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadInvoices = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('invoices')
        .select('*, customers(name)')
        .order('created_at', { ascending: false })

      if (isMounted && !error) {
        setInvoices(data || [])
        setLoading(false)
      }
    }

    loadInvoices()

    return () => {
      isMounted = false
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700'
      case 'sent':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Invoices</h1>

        <button
          onClick={() => router.push('/invoice/create')}
          className="bg-deepgreen text-white px-4 py-2 rounded-lg"
        >
          Create Invoice
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading...</p>
      ) : invoices.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-gray-500">
          <p className="text-lg">No invoices yet</p>
          <p className="text-sm">Create your first invoice</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Invoice #</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-t cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`/invoice/${inv.id}`)}
                >
                  <td className="p-3">{inv.invoice_number}</td>
                  <td className="p-3">{inv.customers?.name}</td>
                  <td className="p-3 capitalize">{inv.type}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(
                        inv.status
                      )}`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="p-3">₦{inv.total}</td>
                  <td className="p-3">
                    {new Date(inv.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
