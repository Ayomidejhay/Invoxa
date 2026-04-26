
// 'use client'

// import { useEffect, useState } from 'react'
// import { createBrowserClient } from '@supabase/ssr'
// import CustomerModal from './components/AddCustomerModal'

// interface Customer {
//   id: string
//   name: string
//   email: string
//   phone: string
//   address: string
//   created_at: string
// }

// const supabase = createBrowserClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// )

// export default function CustomersPage() {

//   const [customers, setCustomers] = useState<Customer[]>([])
//   const [loading, setLoading] = useState(true)
//   const [modalOpen, setModalOpen] = useState(false)
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined)

//   const fetchCustomers = async () => {
//     const { data, error } = await supabase
//       .from('customers')
//       .select('*')
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
//         .order('created_at', { ascending: false })

//       if (isMounted && !error) {
//         setCustomers(data || [])
//         setLoading(false)
//       }
//     }

//     load()

//     return () => {
//       isMounted = false
//     }
//   }, [])

//   const handleDelete = async (id: string) => {
//     const confirmDelete = confirm('Delete this customer?')
//     if (!confirmDelete) return

//     await supabase.from('customers').delete().eq('id', id)
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
//           className="bg-deepgreen text-light px-4 py-2 rounded-lg"
//         >
//           Add Customer
//         </button>
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : customers.length === 0 ? (
//         <div className="flex flex-col items-center py-20 text-gray-500">
//           <p className="text-lg">No customers yet</p>
//         </div>
//       ) : (
//         <div className="bg-white border rounded-xl overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="p-3 text-left">Name</th>
//                 <th className="p-3 text-left">Email</th>
//                 <th className="p-3 text-left">Phone</th>
//                 <th className="p-3 text-left">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {customers.map((c) => (
//                 <tr key={c.id} className="border-t">
//                   <td className="p-3">{c.name}</td>
//                   <td className="p-3">{c.email}</td>
//                   <td className="p-3">{c.phone}</td>

//                   <td className="p-3 flex gap-3">
//                     <button
//                       onClick={() => {
//                         setSelectedCustomer(c)
//                         setModalOpen(true)
//                       }}
//                       className="text-blue-600 cursor-pointer"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => handleDelete(c.id)}
//                       className="text-red-600 cursor-pointer"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
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

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import CustomerModal from './components/AddCustomerModal'
import { FiEdit2, FiTrash2, FiMail, FiPhone, FiUser } from 'react-icons/fi'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  created_at: string
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined)

  // const fetchCustomers = async () => {
  //   const { data, error } = await supabase
  //     .from('customers')
  //     .select('*')
  //     .order('created_at', { ascending: false })

  //   if (!error) setCustomers(data || [])
  // }

  // useEffect(() => {
  //   fetchCustomers()
  //   setLoading(false)
  // }, [])

  // const handleDelete = async (id: string) => {
  //   if (!confirm('Delete this customer?')) return

  //   await supabase.from('customers').delete().eq('id', id)
  //   fetchCustomers()
  // }
  const fetchCustomers = async () => {
    const { data, error } = await supabase
       .from('customers')
       .select('*')
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
         .order('created_at', { ascending: false })

       if (isMounted && !error) {
         setCustomers(data || [])
         setLoading(false)
       }
     }

     load()

     return () => {
       isMounted = false
     }
   }, [])

   const handleDelete = async (id: string) => {
     const confirmDelete = confirm('Delete this customer?')
     if (!confirmDelete) return

     await supabase.from('customers').delete().eq('id', id)
     fetchCustomers()
   }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Customers</h1>
        <button
          onClick={() => {
            setSelectedCustomer(undefined)
            setModalOpen(true)
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Add Customer
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-gray-500 border-2 border-dashed rounded-xl">
          <p>No customers found</p>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW: Cards */}
          <div className="md:hidden space-y-4">
            {customers.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    <FiUser className="text-green-600" />
                    {c.name}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedCustomer(c); setModalOpen(true); }} className="text-blue-600 p-2"><FiEdit2 size={18}/></button>
                    <button onClick={() => handleDelete(c.id)} className="text-red-600 p-2"><FiTrash2 size={18}/></button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center gap-2"><FiMail size={14}/> {c.email}</p>
                  <p className="flex items-center gap-2"><FiPhone size={14}/> {c.phone}</p>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Table */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-left font-medium text-gray-500">Name</th>
                  <th className="p-4 text-left font-medium text-gray-500">Email</th>
                  <th className="p-4 text-left font-medium text-gray-500">Phone</th>
                  <th className="p-4 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-4">{c.name}</td>
                    <td className="p-4">{c.email}</td>
                    <td className="p-4">{c.phone}</td>
                    <td className="p-4 flex gap-3">
                      <button onClick={() => { setSelectedCustomer(c); setModalOpen(true); }} className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          }}
        />
      )}
    </div>
  )
}