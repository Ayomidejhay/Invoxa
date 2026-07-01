

// 'use client'

// import { useEffect, useState } from 'react'
// import { getSupabaseClient } from '@/lib/supabase/client'
// import { useOrganization } from '../components/OrganizationProvider'
// import CustomerModal from './components/AddCustomerModal'
// import { FiEdit2, FiTrash2, FiMail, FiPhone, FiUser } from 'react-icons/fi'
// import type { Customer } from '@/lib/supabase/database.types'

// export default function CustomersPage() {
//   const supabase = getSupabaseClient()
//   const { organization, isOwnerOrAdmin } = useOrganization()

//   const [customers, setCustomers] = useState<Customer[]>([])
//   const [loading, setLoading] = useState(true)
//   const [modalOpen, setModalOpen] = useState(false)
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined)
//   const [deleteError, setDeleteError] = useState<string | null>(null)

//   const fetchCustomers = async () => {
//     const { data, error } = await supabase
//       .from('customers')
//       .select('*')
//       .eq('organization_id', organization.id)
//       .order('created_at', { ascending: false })

//     if (!error) setCustomers(data || [])
//   }

//   useEffect(() => {
//     let isMounted = true

//     const load = async () => {
//       setLoading(true)
//       const { data, error } = await supabase
//         .from('customers')
//         .select('*')
//         .eq('organization_id', organization.id)
//         .order('created_at', { ascending: false })

//       if (isMounted) {
//         if (!error) setCustomers(data || [])
//         setLoading(false)
//       }
//     }

//     load()
//     return () => {
//       isMounted = false
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [organization.id])

//   const handleDelete = async (id: string) => {
//     if (!confirm('Delete this customer?')) return
//     setDeleteError(null)

//     const { error } = await supabase.from('customers').delete().eq('id', id)
//     if (error) {
//       setDeleteError(
//         error.code === '23503'
//           ? "This customer has invoices on file and can't be deleted."
//           : error.message
//       )
//       return
//     }
//     fetchCustomers()
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold">Customers</h1>
//         <button
//           onClick={() => {
//             setSelectedCustomer(undefined)
//             setModalOpen(true)
//           }}
//           className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//         >
//           Add Customer
//         </button>
//       </div>

//       {deleteError && (
//         <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
//           {deleteError}
//         </div>
//       )}

//       {loading ? (
//         <p>Loading...</p>
//       ) : customers.length === 0 ? (
//         <div className="flex flex-col items-center py-20 text-gray-500 border-2 border-dashed rounded-xl">
//           <p>No customers found</p>
//         </div>
//       ) : (
//         <>
//           {/* MOBILE VIEW: Cards */}
//           <div className="md:hidden space-y-4">
//             {customers.map((c) => (
//               <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
//                 <div className="flex justify-between items-start">
//                   <div className="flex items-center gap-2 font-bold text-gray-900">
//                     <FiUser className="text-green-600" />
//                     {c.name}
//                   </div>
//                   <div className="flex gap-2">
//                     <button onClick={() => { setSelectedCustomer(c); setModalOpen(true) }} className="text-blue-600 p-2">
//                       <FiEdit2 size={18} />
//                     </button>
//                     {isOwnerOrAdmin && (
//                       <button onClick={() => handleDelete(c.id)} className="text-red-600 p-2">
//                         <FiTrash2 size={18} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//                 <div className="text-sm text-gray-600 space-y-1">
//                   {c.email && <p className="flex items-center gap-2"><FiMail size={14} /> {c.email}</p>}
//                   {c.phone && <p className="flex items-center gap-2"><FiPhone size={14} /> {c.phone}</p>}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* DESKTOP VIEW: Table */}
//           <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50 border-b">
//                 <tr>
//                   <th className="p-4 text-left font-medium text-gray-500">Name</th>
//                   <th className="p-4 text-left font-medium text-gray-500">Email</th>
//                   <th className="p-4 text-left font-medium text-gray-500">Phone</th>
//                   <th className="p-4 text-left font-medium text-gray-500">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {customers.map((c) => (
//                   <tr key={c.id} className="border-t hover:bg-gray-50 transition">
//                     <td className="p-4">{c.name}</td>
//                     <td className="p-4">{c.email}</td>
//                     <td className="p-4">{c.phone}</td>
//                     <td className="p-4 flex gap-3">
//                       <button onClick={() => { setSelectedCustomer(c); setModalOpen(true) }} className="text-blue-600 hover:text-blue-800">
//                         Edit
//                       </button>
//                       {isOwnerOrAdmin && (
//                         <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800">
//                           Delete
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}

//       {modalOpen && (
//         <CustomerModal
//           customer={selectedCustomer}
//           onClose={() => setModalOpen(false)}
//           onSuccess={() => {
//             setModalOpen(false)
//             fetchCustomers()
//           }}
//         />
//       )}
//     </div>
//   )
// }


'use client'

import { useEffect, useMemo, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useOrganization } from '../components/OrganizationProvider'
import CustomerModal from './components/AddCustomerModal'
import { FiEdit2, FiTrash2, FiMail, FiPhone, FiUser, FiSearch } from 'react-icons/fi'
import type { Customer } from '@/lib/supabase/database.types'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { SkeletonRow, SkeletonCard } from '@/app/components/ui/Skeleton'
import { Pagination } from '@/app/components/ui/Pagination'
import { usePagination } from '@/app/components/ui/usePagination'
import { useConfirm } from '@/app/components/ui/useConfirm'
import { useToast } from '@/app/components/ui/Toast'

export default function CustomersPage() {
  const supabase = getSupabaseClient()
  const { organization, isOwnerOrAdmin } = useOrganization()
  const toast = useToast()
  const { confirm, dialog: confirmDialog } = useConfirm()

  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined)

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('organization_id', organization.id)
      .order('created_at', { ascending: false })

    if (!error) setCustomers(data || [])
  }

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })

      if (isMounted) {
        if (!error) setCustomers(data || [])
        setLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization.id])

  const filtered = useMemo(() => {
    if (!search.trim()) return customers
    const q = search.toLowerCase()
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.includes(q)
    )
  }, [customers, search])

  const { page, setPage, pageCount, pageItems, totalItems, pageSize } = usePagination(filtered, 10)

  const handleDelete = async (customer: Customer) => {
    const ok = await confirm({
      title: `Delete ${customer.name}?`,
      description: 'This cannot be undone.',
      confirmLabel: 'Delete',
      tone: 'danger',
    })
    if (!ok) return

    const { error } = await supabase.from('customers').delete().eq('id', customer.id)
    if (error) {
      toast.error(
        error.code === '23503'
          ? "This customer has invoices on file and can't be deleted."
          : error.message
      )
      return
    }
    toast.success('Customer deleted')
    fetchCustomers()
  }

  return (
    <div className="space-y-6 bg-[#1E1E1E] text-white">
      {confirmDialog}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-white">Customers</h1>
        <Button
          onClick={() => {
            setSelectedCustomer(undefined)
            setModalOpen(true)
          }}
        >
          Add Customer
        </Button>
      </div>

      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="pl-10 bg-[#202023] border border-zinc-800 text-white rounded-lg placeholder-zinc-500"
        />
      </div>

      {loading ? (
        <>
          <div className="md:hidden space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#202023] border border-zinc-800 p-4 rounded-xl h-24 animate-pulse" />
            ))}
          </div>
          <table className="hidden md:table w-full text-sm bg-[#202023] border border-zinc-850 rounded-xl overflow-hidden">
            <tbody>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} columns={4} />)}</tbody>
          </table>
        </>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FiUser size={28} />}
          title={customers.length === 0 ? 'No customers yet' : 'No customers match your search'}
          description={customers.length === 0 ? 'Add your first customer to start invoicing.' : undefined}
          action={
            customers.length === 0 ? (
              <Button onClick={() => setModalOpen(true)}>Add Customer</Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* MOBILE VIEW: Cards */}
          <div className="md:hidden space-y-4">
            {pageItems.map((c) => (
              <div key={c.id} className="bg-[#202023] p-4 rounded-xl border border-zinc-800 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 font-bold text-zinc-100">
                    <FiUser className="text-[#60A5FA]" />
                    {c.name}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedCustomer(c); setModalOpen(true) }} className="text-blue-400 p-2 cursor-pointer hover:text-blue-300">
                      <FiEdit2 size={18} />
                    </button>
                    {isOwnerOrAdmin && (
                      <button onClick={() => handleDelete(c)} className="text-red-400 p-2 cursor-pointer hover:text-red-300">
                        <FiTrash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-sm text-zinc-400 space-y-1">
                  {c.email && <p className="flex items-center gap-2"><FiMail size={14} /> {c.email}</p>}
                  {c.phone && <p className="flex items-center gap-2"><FiPhone size={14} /> {c.phone}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Table */}
          <div className="hidden md:block bg-[#202023] border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#1A1A1C] border-b border-zinc-800">
                <tr>
                  <th className="p-4 text-left font-semibold text-zinc-400">Name</th>
                  <th className="p-4 text-left font-semibold text-zinc-400">Email</th>
                  <th className="p-4 text-left font-semibold text-zinc-400">Phone</th>
                  <th className="p-4 text-left font-semibold text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((c) => (
                  <tr key={c.id} className="border-t border-zinc-800/80 hover:bg-zinc-800/30 transition text-zinc-300">
                    <td className="p-4 font-semibold text-white">{c.name}</td>
                    <td className="p-4 text-zinc-300">{c.email}</td>
                    <td className="p-4 text-zinc-350 font-mono">{c.phone}</td>
                    <td className="p-4 flex gap-3 items-center">
                      <button onClick={() => { setSelectedCustomer(c); setModalOpen(true) }} className="text-blue-400 hover:text-blue-300 cursor-pointer text-sm">
                        Edit
                      </button>
                      {isOwnerOrAdmin && (
                        <button onClick={() => handleDelete(c)} className="text-red-400 hover:text-red-300 cursor-pointer text-sm">
                          Delete
                        </button>
                      )}
                    </td>
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

      {modalOpen && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false)
            fetchCustomers()
            toast.success(selectedCustomer ? 'Customer updated' : 'Customer added')
          }}
        />
      )}
    </div>
  )
}
