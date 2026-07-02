// 'use client'

// import { useEffect, useMemo, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { FiFileText, FiUser, FiCalendar, FiSearch } from 'react-icons/fi'
// import { getSupabaseClient } from '@/lib/supabase/client'
// import { useOrganization } from '../components/OrganizationProvider'
// import type { InvoiceStatus, InvoiceType } from '@/lib/supabase/database.types'
// import { Button } from '@/app/components/ui/Button'
// import { Input } from '@/app/components/ui/Input'
// import { Select } from '@/app/components/ui/Select'
// import { StatusBadge, TypeBadge } from '@/app/components/ui/Badge'
// import { EmptyState } from '@/app/components/ui/EmptyState'
// import { SkeletonRow, SkeletonCard } from '@/app/components/ui/Skeleton'
// import { Pagination } from '@/app/components/ui/Pagination'
// import { usePagination } from '@/app/components/ui/usePagination'
// import { formatCurrency } from '@/lib/format'

// type Invoice = {
//   id: string
//   invoice_number: string
//   type: InvoiceType
//   status: InvoiceStatus
//   total: number
//   currency: string
//   created_at: string
//   customers?: { name: string }
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

//   const { page, setPage, pageCount, pageItems, totalItems, pageSize } = usePagination(filtered, 10)

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <h1 className="text-xl font-semibold text-dark">Invoices</h1>
//         <Button onClick={() => router.push('/invoice/create')}>Create Invoice</Button>
//       </div>

//       <div className="flex flex-wrap gap-3">
//         <div className="relative flex-1 min-w-[220px]">
//           <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
//           <Input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search invoice # or customer..."
//             className="pl-9"
//           />
//         </div>
//         <Select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value as 'all' | InvoiceStatus)}
//           className="w-auto"
//         >
//           <option value="all">All statuses</option>
//           <option value="draft">Draft</option>
//           <option value="sent">Sent</option>
//           <option value="paid">Paid</option>
//           <option value="overdue">Overdue</option>
//           <option value="void">Void</option>
//         </Select>
//       </div>

//       {loading ? (
//         <>
//           <div className="md:hidden space-y-4">
//             {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
//           </div>
//           <table className="hidden md:table w-full text-sm bg-white border border-border rounded-xl overflow-hidden">
//             <tbody>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} columns={6} />)}</tbody>
//           </table>
//         </>
//       ) : filtered.length === 0 ? (
//         <EmptyState
//           icon={<FiFileText size={28} />}
//           title={invoices.length === 0 ? 'No invoices yet' : 'No invoices match your filters'}
//           description={invoices.length === 0 ? 'Create your first invoice to get paid.' : undefined}
//           action={
//             invoices.length === 0 ? (
//               <Button onClick={() => router.push('/invoice/create')}>Create Invoice</Button>
//             ) : undefined
//           }
//         />
//       ) : (
//         <>
//           {/* MOBILE VIEW: Cards */}
//           <div className="md:hidden space-y-4">
//             {pageItems.map((inv) => (
//               <div
//                 key={inv.id}
//                 onClick={() => router.push(`/invoice/${inv.id}`)}
//                 className="bg-white p-4 rounded-xl border border-border shadow-sm cursor-pointer hover:border-deepgreen transition-colors"
//               >
//                 <div className="flex justify-between items-start mb-3">
//                   <div className="flex items-center gap-2 font-bold text-dark font-mono">
//                     <FiFileText className="text-deepgreen" />
//                     {inv.invoice_number}
//                   </div>
//                   <StatusBadge status={inv.status} />
//                 </div>

//                 <div className="space-y-2 text-sm text-muted">
//                   <div className="flex justify-between">
//                     <span className="flex items-center gap-2"><FiUser size={14} /> {inv.customers?.name || 'N/A'}</span>
//                     <span className="font-mono font-semibold text-dark">{formatCurrency(inv.total, inv.currency)}</span>
//                   </div>
//                   <div className="flex justify-between items-center text-xs">
//                     <TypeBadge type={inv.type} />
//                     <span className="flex items-center gap-1"><FiCalendar size={12} /> {new Date(inv.created_at).toLocaleDateString()}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* DESKTOP VIEW: Table */}
//           <div className="hidden md:block bg-white border border-border rounded-xl overflow-hidden shadow-sm">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50 border-b border-border">
//                 <tr>
//                   <th className="p-4 text-left font-medium text-muted">Invoice #</th>
//                   <th className="p-4 text-left font-medium text-muted">Customer</th>
//                   <th className="p-4 text-left font-medium text-muted">Type</th>
//                   <th className="p-4 text-left font-medium text-muted">Status</th>
//                   <th className="p-4 text-left font-medium text-muted">Total</th>
//                   <th className="p-4 text-left font-medium text-muted">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pageItems.map((inv) => (
//                   <tr
//                     key={inv.id}
//                     className="border-t border-border hover:bg-gray-50 cursor-pointer transition"
//                     onClick={() => router.push(`/invoice/${inv.id}`)}
//                   >
//                     <td className="p-4 font-medium text-dark font-mono">{inv.invoice_number}</td>
//                     <td className="p-4 text-muted">{inv.customers?.name}</td>
//                     <td className="p-4"><TypeBadge type={inv.type} /></td>
//                     <td className="p-4"><StatusBadge status={inv.status} /></td>
//                     <td className="p-4 font-mono font-semibold text-dark">{formatCurrency(inv.total, inv.currency)}</td>
//                     <td className="p-4 text-muted">{new Date(inv.created_at).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <Pagination page={page} pageCount={pageCount} onPageChange={setPage} totalItems={totalItems} pageSize={pageSize} />
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
import { formatCurrency } from '@/lib/format'

type Invoice = {
  id: string
  invoice_number: string
  type: InvoiceType
  status: InvoiceStatus
  total: number
  currency: string
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
    <div className="space-y-6 text-dark dark:text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-dark dark:text-white">Invoices</h1>
        <Button
          onClick={() => router.push('/invoice/create')}
          className="bg-[#1E3A8A] text-white border border-blue-700/50 hover:bg-blue-700 font-semibold px-4 py-2 flex items-center gap-1.5"
        >
          <span>+ Create invoice</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice number or customer"
            className="pl-10 bg-white dark:bg-[#202023] border border-slate-200 dark:border-zinc-800 text-dark dark:text-white rounded-lg focus:ring-0 placeholder-zinc-500"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | InvoiceStatus)}
          className="w-auto bg-white dark:bg-[#202023] border border-slate-200 dark:border-zinc-800 text-dark dark:text-white rounded-lg"
        >
          <option value="all" className="bg-white dark:bg-[#202023] text-dark dark:text-white">All statuses</option>
          <option value="draft" className="bg-white dark:bg-[#202023] text-dark dark:text-white">Draft</option>
          <option value="sent" className="bg-white dark:bg-[#202023] text-dark dark:text-white">Sent</option>
          <option value="partial" className="bg-white dark:bg-[#202023] text-dark dark:text-white">Partial</option>
          <option value="paid" className="bg-white dark:bg-[#202023] text-dark dark:text-white">Paid</option>
          <option value="overdue" className="bg-white dark:bg-[#202023] text-dark dark:text-white">Overdue</option>
          <option value="void" className="bg-white dark:bg-[#202023] text-dark dark:text-white">Void</option>
        </Select>
      </div>

      {loading ? (
        <>
          <div className="md:hidden space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-slate-50 dark:bg-[#202023] border border-slate-150 dark:border-zinc-800 p-4 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
          <table className="hidden md:table w-full text-sm bg-white dark:bg-[#202023] border border-slate-200 dark:border-zinc-850 rounded-xl overflow-hidden shadow-sm">
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
                className="bg-white dark:bg-[#202023] p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 cursor-pointer hover:border-slate-350 dark:hover:border-zinc-700 transition-colors relative pl-6 shadow-sm"
              >
                <div
                  className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-md ${
                    inv.type === 'sale' ? 'bg-[#1E3A8A]' : 'bg-[#C05621]'
                  }`}
                />
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 font-bold text-dark dark:text-zinc-100 font-mono text-sm">
                    <FiFileText className="text-zinc-450 dark:text-zinc-400" />
                    {inv.invoice_number}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      inv.status === 'paid' ? 'bg-green-500' :
                      inv.status === 'partial' ? 'bg-purple-500' :
                      inv.status === 'draft' ? 'bg-zinc-400 dark:bg-zinc-500' :
                      inv.status === 'overdue' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <span className={`text-xs capitalize font-medium ${
                      inv.status === 'paid' ? 'text-green-600 dark:text-green-500' :
                      inv.status === 'partial' ? 'text-purple-650 dark:text-purple-450' :
                      inv.status === 'draft' ? 'text-zinc-500 dark:text-zinc-400' :
                      inv.status === 'overdue' ? 'text-amber-600 dark:text-amber-450' : 'text-red-600 dark:text-red-450'
                    }`}>{inv.status}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-zinc-650 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2"><FiUser size={14} /> {inv.customers?.name || 'N/A'}</span>
                    <span className="font-mono font-semibold text-dark dark:text-zinc-100">{formatCurrency(inv.total, inv.currency)}</span>
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
          <div className="hidden md:block bg-white dark:bg-[#202023] border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-[#1A1A1C] border-b border-slate-200 dark:border-zinc-800">
                <tr>
                  <th className="p-4 text-left font-semibold text-zinc-550 dark:text-zinc-400">Invoice #</th>
                  <th className="p-4 text-left font-semibold text-zinc-550 dark:text-zinc-400">Customer</th>
                  <th className="p-4 text-left font-semibold text-zinc-550 dark:text-zinc-400">Type</th>
                  <th className="p-4 text-left font-semibold text-zinc-550 dark:text-zinc-400">Status</th>
                  <th className="p-4 text-left font-semibold text-zinc-550 dark:text-zinc-400">Total</th>
                  <th className="p-4 text-left font-semibold text-zinc-550 dark:text-zinc-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-t border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 cursor-pointer transition text-zinc-655 dark:text-zinc-300"
                    onClick={() => router.push(`/invoice/${inv.id}`)}
                  >
                    <td className={`p-4 font-bold text-dark dark:text-white border-l-4 font-mono ${inv.type === 'sale' ? 'border-l-[#1E3A8A]' : 'border-l-[#C05621]'}`}>
                      {inv.invoice_number}
                    </td>
                    <td className="p-4 text-zinc-650 dark:text-zinc-200">{inv.customers?.name}</td>
                    <td className="p-4"><TypeBadge type={inv.type} /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          inv.status === 'paid' ? 'bg-green-500' :
                          inv.status === 'partial' ? 'bg-purple-500' :
                          inv.status === 'draft' ? 'bg-zinc-500' :
                          inv.status === 'overdue' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <span className={`text-sm capitalize font-medium ${
                          inv.status === 'paid' ? 'text-green-500' :
                          inv.status === 'partial' ? 'text-purple-400' :
                          inv.status === 'draft' ? 'text-zinc-400' :
                          inv.status === 'overdue' ? 'text-amber-400' : 'text-red-400'
                        }`}>{inv.status}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-dark dark:text-white">{formatCurrency(inv.total, inv.currency)}</td>
                    <td className="p-4 text-zinc-650 dark:text-zinc-400">{new Date(inv.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} totalItems={totalItems} pageSize={pageSize} />
          </div>
        </>
      )}
    </div>
  )
}
