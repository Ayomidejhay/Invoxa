
'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import CustomerModal from './components/AddCustomerModal'

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
          className="bg-deepgreen text-light px-4 py-2 rounded-lg"
        >
          Add Customer
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-gray-500">
          <p className="text-lg">No customers yet</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.phone}</td>

                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedCustomer(c)
                        setModalOpen(true)
                      }}
                      className="text-blue-600 cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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


