// ===============================
// CustomerModal.tsx (ADD + EDIT)
// ===============================
'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

interface CustomerModalProps {
  customer?: Customer
  onClose: () => void
  onSuccess: () => void
}

export default function CustomerModal({ customer, onClose, onSuccess }: CustomerModalProps) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [form, setForm] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (!form.name.trim()) return 'Name is required'

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      return 'Invalid email'
    }

    return null
  }

  const handleSubmit = async () => {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError('')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user?.id)
      .single()

    let query

    if (customer) {
      query = supabase
        .from('customers')
        .update(form)
        .eq('id', customer.id)
    } else {
      query = supabase.from('customers').insert({
        ...form,
        organization_id: profile?.organization_id,
      })
    }

    const { error } = await query

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">
          {customer ? 'Edit Customer' : 'Add Customer'}
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium'>Name</label>
            <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-3 rounded-lg"
        />
        </div>

        <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium'>Email</label>
            <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-3 rounded-lg"
        />
        </div>

        <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium'>Phone</label>
            <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full border p-3 rounded-lg"
        />
        </div>

        <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium'>Address</label>
            <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border p-3 rounded-lg"
        />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className='bg-red-600 text-light px-4 py-2 rounded-lg '>Cancel</button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-deepgreen text-light px-4 py-2 rounded-lg"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
