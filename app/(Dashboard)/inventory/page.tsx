// ===============================
// INVENTORY MODULE (PRODUCTS)
// ===============================

// Features:
// - Fetch products (safe useEffect)
// - Empty state
// - Add / Edit product (single modal)
// - Delete product
// - Validation (name + at least one price)
// - Refetch after mutations


// ===============================
// InventoryPage.tsx
// ===============================
'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import ProductModal from './components/ProductModal'

interface Product {
  id: string
  name: string
  description: string
  sale_price: number | null
  rental_price: number | null
  stock: number
  created_at: string
}

export default function InventoryPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setProducts(data || [])
  }

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (isMounted && !error) {
        setProducts(data || [])
        setLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Delete this product?')
    if (!confirmDelete) return

    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Inventory</h1>

        <button
          onClick={() => {
            setSelectedProduct(undefined)
            setModalOpen(true)
          }}
          className="bg-deepgreen text-light px-4 py-2 rounded-lg"
        >
          Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-gray-500">
          <p className="text-lg">No products yet</p>
          <p className="text-sm">Add your first product</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Sale Price</th>
                <th className="p-3 text-left">Rental Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.sale_price ?? '-'}</td>
                  <td className="p-3">{p.rental_price ?? '-'}</td>
                  <td className="p-3">{p.stock}</td>

                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedProduct(p)
                        setModalOpen(true)
                      }}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600"
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
        <ProductModal
          product={selectedProduct}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false)
            fetchProducts()
          }}
        />
      )}
    </div>
  )
}

