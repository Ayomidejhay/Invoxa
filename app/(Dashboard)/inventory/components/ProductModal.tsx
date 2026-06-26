

// 'use client'

// import { useState } from 'react'
// import { getSupabaseClient } from '@/lib/supabase/client'
// import { useOrganization } from '../../components/OrganizationProvider'
// import type { Product } from '@/lib/supabase/database.types'

// interface ProductModalProps {
//   product?: Product
//   onClose: () => void
//   onSuccess: () => void
// }

// export default function ProductModal({ product, onClose, onSuccess }: ProductModalProps) {
//   const supabase = getSupabaseClient()
//   const { organization } = useOrganization()

//   const [form, setForm] = useState({
//     name: product?.name || '',
//     description: product?.description || '',
//     sku: product?.sku || '',
//     sale_price: product?.sale_price?.toString() || '',
//     rental_price: product?.rental_price?.toString() || '',
//     stock: product?.stock ?? 0,
//     low_stock_threshold: product?.low_stock_threshold?.toString() || '5',
//   })

//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const validate = () => {
//     if (!form.name.trim()) return 'Product name is required'
//     if (!form.sale_price && !form.rental_price) {
//       return 'At least one price (sale or rental) is required'
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

//     const payload = {
//       name: form.name,
//       description: form.description || null,
//       sku: form.sku || null,
//       sale_price: form.sale_price ? Number(form.sale_price) : null,
//       rental_price: form.rental_price ? Number(form.rental_price) : null,
//       stock: Number(form.stock) || 0,
//       low_stock_threshold: form.low_stock_threshold ? Number(form.low_stock_threshold) : null,
//     }

//     const { error } = product
//       ? await supabase.from('products').update(payload).eq('id', product.id)
//       : await supabase.from('products').insert({ ...payload, organization_id: organization.id })

//     setLoading(false)

//     if (error) {
//       setError(error.message)
//       return
//     }

//     onSuccess()
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
//         <h2 className="text-lg font-semibold">{product ? 'Edit Product' : 'Add Product'}</h2>

//         {error && <p className="text-red-500 text-sm">{error}</p>}

//         <div className="flex flex-col gap-1">
//           <label htmlFor="name">Product Name *</label>
//           <input name="name" value={form.name} onChange={handleChange} className="w-full border p-3 rounded-lg" />
//         </div>

//         <div className="flex flex-col gap-1">
//           <label htmlFor="description">Description</label>
//           <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-3 rounded-lg" />
//         </div>

//         <div className="flex flex-col gap-1">
//           <label htmlFor="sku">SKU</label>
//           <input name="sku" value={form.sku} onChange={handleChange} className="w-full border p-3 rounded-lg" />
//         </div>

//         <div className="grid grid-cols-2 gap-3">
//           <div className="flex flex-col gap-1">
//             <label htmlFor="sale_price">Sale Price</label>
//             <input name="sale_price" value={form.sale_price} onChange={handleChange} type="number" min="0" className="w-full border p-3 rounded-lg" />
//           </div>
//           <div className="flex flex-col gap-1">
//             <label htmlFor="rental_price">Rental Price / day</label>
//             <input name="rental_price" value={form.rental_price} onChange={handleChange} type="number" min="0" className="w-full border p-3 rounded-lg" />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-3">
//           <div className="flex flex-col gap-1">
//             <label htmlFor="stock">Stock Quantity</label>
//             <input name="stock" value={form.stock} onChange={handleChange} type="number" min="0" className="w-full border p-3 rounded-lg" />
//           </div>
//           <div className="flex flex-col gap-1">
//             <label htmlFor="low_stock_threshold">Low stock alert at</label>
//             <input name="low_stock_threshold" value={form.low_stock_threshold} onChange={handleChange} type="number" min="0" className="w-full border p-3 rounded-lg" />
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 pt-2">
//           <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg text-gray-700">Cancel</button>
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
import type { Product } from '@/lib/supabase/database.types'
import { Modal } from '@/app/components/ui/Modal'
import { Input } from '@/app/components/ui/Input'
import { Textarea } from '@/app/components/ui/Textarea'
import { Button } from '@/app/components/ui/Button'

interface ProductModalProps {
  product?: Product
  onClose: () => void
  onSuccess: () => void
}

export default function ProductModal({ product, onClose, onSuccess }: ProductModalProps) {
  const supabase = getSupabaseClient()
  const { organization } = useOrganization()

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    sku: product?.sku || '',
    sale_price: product?.sale_price?.toString() || '',
    rental_price: product?.rental_price?.toString() || '',
    stock: product?.stock ?? 0,
    low_stock_threshold: product?.low_stock_threshold?.toString() || '5',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (!form.name.trim()) return 'Product name is required'
    if (!form.sale_price && !form.rental_price) {
      return 'At least one price (sale or rental) is required'
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

    const payload = {
      name: form.name,
      description: form.description || null,
      sku: form.sku || null,
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      rental_price: form.rental_price ? Number(form.rental_price) : null,
      stock: Number(form.stock) || 0,
      low_stock_threshold: form.low_stock_threshold ? Number(form.low_stock_threshold) : null,
    }

    const { error } = product
      ? await supabase.from('products').update(payload).eq('id', product.id)
      : await supabase.from('products').insert({ ...payload, organization_id: organization.id })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    onSuccess()
  }

  return (
    <Modal open onClose={onClose} title={product ? 'Edit Product' : 'Add Product'} size="md">
      <div className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <Input label="Product Name *" name="name" value={form.name} onChange={handleChange} />
        <Textarea label="Description" name="description" value={form.description} onChange={handleChange} />
        <Input label="SKU" name="sku" value={form.sku} onChange={handleChange} />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Sale Price" name="sale_price" value={form.sale_price} onChange={handleChange} type="number" min="0" />
          <Input label="Rental Price / day" name="rental_price" value={form.rental_price} onChange={handleChange} type="number" min="0" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Stock Quantity" name="stock" value={form.stock} onChange={handleChange} type="number" min="0" />
          <Input label="Low stock alert at" name="low_stock_threshold" value={form.low_stock_threshold} onChange={handleChange} type="number" min="0" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>Save</Button>
        </div>
      </div>
    </Modal>
  )
}
