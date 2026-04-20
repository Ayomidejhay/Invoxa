
// ===============================
// ProductModal.tsx
// ===============================
'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface ProductModalProps {
  product?: {
    id: string
    name: string
    description: string
    sale_price: number | null
    rental_price: number | null
    stock: number
  }
  onClose: () => void
  onSuccess: () => void
}

export default function ProductModal({ product, onClose, onSuccess }: ProductModalProps) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    sale_price: product?.sale_price || '',
    rental_price: product?.rental_price || '',
    stock: product?.stock || 0,
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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user?.id)
      .single()

    const payload = {
      name: form.name,
      description: form.description,
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      rental_price: form.rental_price ? Number(form.rental_price) : null,
      stock: Number(form.stock) || 0,
    }

    let query

    if (product) {
      query = supabase
        .from('products')
        .update(payload)
        .eq('id', product.id)
    } else {
      query = supabase.from('products').insert({
        ...payload,
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
          {product ? 'Edit Product' : 'Add Product'}
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className='flex flex-col gap-1'>
            <label htmlFor="name">Product Name *</label>
            <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name *"
          className="w-full border p-3 rounded-lg"
        />
        </div>

        <div className='flex flex-col gap-1'>
            <label htmlFor="description">Description</label>
            <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-3 rounded-lg"
        />
        </div>

        <div className='flex flex-col gap-1'>
            <label htmlFor="sale_price">Sale Price</label>
            <input
          name="sale_price"
          value={form.sale_price}
          onChange={handleChange}
          placeholder="Sale Price"
          type="number"
          className="w-full border p-3 rounded-lg"
        />
        </div>

        <div className='flex flex-col gap-1'>
            <label htmlFor="rental_price">Rental Price</label>
            <input
          name="rental_price"
          value={form.rental_price}
          onChange={handleChange}
          placeholder="Rental Price (per day)"
          type="number"
          className="w-full border p-3 rounded-lg"
        />
        </div>

        <div className='flex flex-col gap-1'>
            <label htmlFor="stock">Stock Quantity</label>
            <input
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock Quantity"
          type="number"
          className="w-full border p-3 rounded-lg"
        />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className='bg-red-600 px-4 py-2 rounded-lg text-light'>Cancel</button>

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
