

// 'use client'

// import { useEffect, useMemo, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { FiFileText, FiUser, FiCalendar } from 'react-icons/fi'
// import { getSupabaseClient } from '@/lib/supabase/client'
// import { useOrganization } from '../components/OrganizationProvider'
// import type { InvoiceStatus, InvoiceType } from '@/lib/supabase/database.types'

// type Invoice = {
//   id: string
//   invoice_number: string
//   type: InvoiceType
//   status: InvoiceStatus
//   total: number
//   created_at: string
//   customers?: { name: string }
// }

// const STATUS_COLORS: Record<InvoiceStatus, string> = {
//   draft: 'bg-gray-100 text-gray-600',
//   sent: 'bg-yellow-100 text-yellow-700',
//   paid: 'bg-green-100 text-green-700',
//   overdue: 'bg-amber-100 text-amber-700',
//   void: 'bg-red-100 text-red-700',
// }

// export default function InvoicePage() {
//   const router = useRouter()
//   const supabase = getSupabaseClient()
//   const { organization } = useOrganization()

//   const [invoices, setInvoices] = useState<Invoice[]>([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState('')
//   const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all')

//   useEffect(() => {
//     let isMounted = true

//     const loadInvoices = async () => {
//       setLoading(true)
//       const { data, error } = await supabase
//         .from('invoices')
//         .select('*, customers(name)')
//         .eq('organization_id', organization.id)
//         .order('created_at', { ascending: false })

//       if (isMounted) {
//         if (!error) setInvoices(data || [])
//         setLoading(false)
//       }
//     }

//     loadInvoices()
//     return () => {
//       isMounted = false
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [organization.id])

//   const filtered = useMemo(() => {
//     return invoices.filter((inv) => {
//       if (statusFilter !== 'all' && inv.status !== statusFilter) return false
//       if (!search.trim()) return true
//       const q = search.toLowerCase()
//       return (
//         inv.invoice_number?.toLowerCase().includes(q) ||
//         inv.customers?.name?.toLowerCase().includes(q)
//       )
//     })
//   }, [invoices, search, statusFilter])

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold">Invoices</h1>
//         <button
//           onClick={() => router.push('/invoice/create')}
//           className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//         >
//           Create Invoice
//         </button>
//       </div>

//       <div className="flex flex-wrap gap-3">
//         <input
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search invoice # or customer..."
//           className="border p-2 rounded-lg flex-1 min-w-[200px]"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value as 'all' | InvoiceStatus)}
//           className="border p-2 rounded-lg"
//         >
//           <option value="all">All statuses</option>
//           <option value="draft">Draft</option>
//           <option value="sent">Sent</option>
//           <option value="paid">Paid</option>
//           <option value="overdue">Overdue</option>
//           <option value="void">Void</option>
//         </select>
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : filtered.length === 0 ? (
//         <div className="flex flex-col items-center py-20 text-gray-500 border-2 border-dashed rounded-xl">
//           <p>{invoices.length === 0 ? 'No invoices yet' : 'No invoices match your filters'}</p>
//         </div>
//       ) : (
//         <>
//           {/* MOBILE VIEW: Cards */}
//           <div className="md:hidden space-y-4">
//             {filtered.map((inv) => (
//               <div
//                 key={inv.id}
//                 onClick={() => router.push(`/invoice/${inv.id}`)}
//                 className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-green-500 transition-colors"
//               >
//                 <div className="flex justify-between items-start mb-3">
//                   <div className="flex items-center gap-2 font-bold text-gray-900">
//                     <FiFileText className="text-green-600" />
//                     {inv.invoice_number}
//                   </div>
//                   <span className={`px-2 py-1 rounded-full text-[10px] font-medium uppercase ${STATUS_COLORS[inv.status]}`}>
//                     {inv.status}
//                   </span>
//                 </div>

//                 <div className="space-y-2 text-sm text-gray-600">
//                   <div className="flex justify-between">
//                     <span className="flex items-center gap-2"><FiUser size={14} /> {inv.customers?.name || 'N/A'}</span>
//                     <span className="font-semibold text-gray-900">₦{inv.total.toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between text-xs text-gray-400">
//                     <span className="capitalize">{inv.type}</span>
//                     <span className="flex items-center gap-1"><FiCalendar size={12} /> {new Date(inv.created_at).toLocaleDateString()}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* DESKTOP VIEW: Table */}
//           <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50 border-b">
//                 <tr>
//                   <th className="p-4 text-left font-medium text-gray-500">Invoice #</th>
//                   <th className="p-4 text-left font-medium text-gray-500">Customer</th>
//                   <th className="p-4 text-left font-medium text-gray-500">Type</th>
//                   <th className="p-4 text-left font-medium text-gray-500">Status</th>
//                   <th className="p-4 text-left font-medium text-gray-500">Total</th>
//                   <th className="p-4 text-left font-medium text-gray-500">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.map((inv) => (
//                   <tr
//                     key={inv.id}
//                     className="border-t hover:bg-gray-50 cursor-pointer transition"
//                     onClick={() => router.push(`/invoice/${inv.id}`)}
//                   >
//                     <td className="p-4 font-medium text-gray-900">{inv.invoice_number}</td>
//                     <td className="p-4 text-gray-600">{inv.customers?.name}</td>
//                     <td className="p-4 capitalize text-gray-600">{inv.type}</td>
//                     <td className="p-4">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[inv.status]}`}>
//                         {inv.status}
//                       </span>
//                     </td>
//                     <td className="p-4 font-semibold text-gray-900">₦{inv.total.toLocaleString()}</td>
//                     <td className="p-4 text-gray-600">{new Date(inv.created_at).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }


'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiFileText, FiUser, FiCalendar, FiSearch } from 'react-icons/fi'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useOrganization } from '../components/OrganizationProvider'
import type { InvoiceStatus, InvoiceType } from '@/lib/supabase/database.types'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { Select } from '@/app/components/ui/Select'
import { StatusBadge, TypeBadge } from '@/app/components/ui/Badge'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { SkeletonRow, SkeletonCard } from '@/app/components/ui/Skeleton'
import { Pagination } from '@/app/components/ui/Pagination'
import { usePagination } from '@/app/components/ui/usePagination'

type Invoice = {
  id: string
  invoice_number: string
  type: InvoiceType
  status: InvoiceStatus
  total: number
  created_at: string
  customers?: { name: string }
}

export default function InvoicePage() {
  const router = useRouter()
  const supabase = getSupabaseClient()
  const { organization } = useOrganization()

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all')

  useEffect(() => {
    let isMounted = true

    const loadInvoices = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('invoices')
        .select('*, customers(name)')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })

      if (isMounted) {
        if (!error) setInvoices(data || [])
        setLoading(false)
      }
    }

    loadInvoices()
    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization.id])

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        inv.invoice_number?.toLowerCase().includes(q) ||
        inv.customers?.name?.toLowerCase().includes(q)
      )
    })
  }, [invoices, search, statusFilter])

  const { page, setPage, pageCount, pageItems, totalItems, pageSize } = usePagination(filtered, 10)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-dark">Invoices</h1>
        <Button onClick={() => router.push('/invoice/create')}>Create Invoice</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice # or customer..."
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | InvoiceStatus)}
          className="w-auto"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="void">Void</option>
        </Select>
      </div>

      {loading ? (
        <>
          <div className="md:hidden space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <table className="hidden md:table w-full text-sm bg-white border border-border rounded-xl overflow-hidden">
            <tbody>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} columns={6} />)}</tbody>
          </table>
        </>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FiFileText size={28} />}
          title={invoices.length === 0 ? 'No invoices yet' : 'No invoices match your filters'}
          description={invoices.length === 0 ? 'Create your first invoice to get paid.' : undefined}
          action={
            invoices.length === 0 ? (
              <Button onClick={() => router.push('/invoice/create')}>Create Invoice</Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* MOBILE VIEW: Cards */}
          <div className="md:hidden space-y-4">
            {pageItems.map((inv) => (
              <div
                key={inv.id}
                onClick={() => router.push(`/invoice/${inv.id}`)}
                className="bg-white p-4 rounded-xl border border-border shadow-sm cursor-pointer hover:border-deepgreen transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 font-bold text-dark font-mono">
                    <FiFileText className="text-deepgreen" />
                    {inv.invoice_number}
                  </div>
                  <StatusBadge status={inv.status} />
                </div>

                <div className="space-y-2 text-sm text-muted">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2"><FiUser size={14} /> {inv.customers?.name || 'N/A'}</span>
                    <span className="font-mono font-semibold text-dark">₦{inv.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <TypeBadge type={inv.type} />
                    <span className="flex items-center gap-1"><FiCalendar size={12} /> {new Date(inv.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Table */}
          <div className="hidden md:block bg-white border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="p-4 text-left font-medium text-muted">Invoice #</th>
                  <th className="p-4 text-left font-medium text-muted">Customer</th>
                  <th className="p-4 text-left font-medium text-muted">Type</th>
                  <th className="p-4 text-left font-medium text-muted">Status</th>
                  <th className="p-4 text-left font-medium text-muted">Total</th>
                  <th className="p-4 text-left font-medium text-muted">Date</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-t border-border hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => router.push(`/invoice/${inv.id}`)}
                  >
                    <td className="p-4 font-medium text-dark font-mono">{inv.invoice_number}</td>
                    <td className="p-4 text-muted">{inv.customers?.name}</td>
                    <td className="p-4"><TypeBadge type={inv.type} /></td>
                    <td className="p-4"><StatusBadge status={inv.status} /></td>
                    <td className="p-4 font-mono font-semibold text-dark">₦{inv.total.toLocaleString()}</td>
                    <td className="p-4 text-muted">{new Date(inv.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} totalItems={totalItems} pageSize={pageSize} />
        </>
      )}
    </div>
  )
}
