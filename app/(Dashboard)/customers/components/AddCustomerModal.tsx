

// 'use client'

// import { useState } from 'react'
// import { getSupabaseClient } from '@/lib/supabase/client'
// import { useOrganization } from '../../components/OrganizationProvider'
// import type { Customer } from '@/lib/supabase/database.types'

// interface CustomerModalProps {
//   customer?: Customer
//   onClose: () => void
//   onSuccess: () => void
// }

// export default function CustomerModal({ customer, onClose, onSuccess }: CustomerModalProps) {
//   const supabase = getSupabaseClient()
//   const { organization } = useOrganization()

//   const [form, setForm] = useState({
//     name: customer?.name || '',
//     email: customer?.email || '',
//     phone: customer?.phone || '',
//     address: customer?.address || '',
//   })

//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const validate = () => {
//     if (!form.name.trim()) return 'Name is required'
//     if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
//       return 'Invalid email'
//     }
//     return null
//   }

//   const handleSubmit = async () => {
//     const validationError = validate()
//     if (validationError) {
//       setError(validationError)
//       return
//     }

//     setLoading(true)
//     setError('')

//     const { error } = customer
//       ? await supabase.from('customers').update(form).eq('id', customer.id)
//       : await supabase.from('customers').insert({ ...form, organization_id: organization.id })

//     setLoading(false)

//     if (error) {
//       setError(error.message)
//       return
//     }

//     onSuccess()
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
//         <h2 className="text-lg font-semibold">{customer ? 'Edit Customer' : 'Add Customer'}</h2>

//         {error && <p className="text-red-500 text-sm">{error}</p>}

//         <div className="flex flex-col gap-1">
//           <label className="text-sm font-medium">Name</label>
//           <input name="name" value={form.name} onChange={handleChange} className="w-full border p-3 rounded-lg" />
//         </div>

//         <div className="flex flex-col gap-1">
//           <label className="text-sm font-medium">Email</label>
//           <input name="email" value={form.email} onChange={handleChange} className="w-full border p-3 rounded-lg" />
//         </div>

//         <div className="flex flex-col gap-1">
//           <label className="text-sm font-medium">Phone</label>
//           <input name="phone" value={form.phone} onChange={handleChange} className="w-full border p-3 rounded-lg" />
//         </div>

//         <div className="flex flex-col gap-1">
//           <label className="text-sm font-medium">Address</label>
//           <input name="address" value={form.address} onChange={handleChange} className="w-full border p-3 rounded-lg" />
//         </div>

//         <div className="flex justify-end gap-3">
//           <button onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">Cancel</button>
//           <button onClick={handleSubmit} disabled={loading} className="bg-deepgreen text-light px-4 py-2 rounded-lg disabled:opacity-50">
//             {loading ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }


'use client'

import { useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useOrganization } from '../../components/OrganizationProvider'
import type { Customer } from '@/lib/supabase/database.types'
import { Modal } from '@/app/components/ui/Modal'
import { Input } from '@/app/components/ui/Input'
import { Button } from '@/app/components/ui/Button'

interface CustomerModalProps {
  customer?: Customer
  onClose: () => void
  onSuccess: () => void
}

export default function CustomerModal({ customer, onClose, onSuccess }: CustomerModalProps) {
  const supabase = getSupabaseClient()
  const { organization } = useOrganization()

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

    const { error } = customer
      ? await supabase.from('customers').update(form).eq('id', customer.id)
      : await supabase.from('customers').insert({ ...form, organization_id: organization.id })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    onSuccess()
  }

  return (
    <Modal open onClose={onClose} title={customer ? 'Edit Customer' : 'Add Customer'} size="md">
      <div className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <Input label="Name" name="name" value={form.name} onChange={handleChange} />
        <Input label="Email" name="email" value={form.email} onChange={handleChange} />
        <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
        <Input label="Address" name="address" value={form.address} onChange={handleChange} />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>Save</Button>
        </div>
      </div>
    </Modal>
  )
}
