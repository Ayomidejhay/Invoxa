

// 'use client'

// import { useEffect, useState } from 'react'
// import { getSupabaseClient } from '@/lib/supabase/client'
// import { useOrganization } from '../components/OrganizationProvider'
// import ProductModal from './components/ProductModal'
// import { FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi'
// import type { Product } from '@/lib/supabase/database.types'

// export default function InventoryPage() {
//   const supabase = getSupabaseClient()
//   const { organization, isOwnerOrAdmin } = useOrganization()

//   const [products, setProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)
//   const [modalOpen, setModalOpen] = useState(false)
//   const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()

//   const fetchProducts = async () => {
//     const { data, error } = await supabase
//       .from('products')
//       .select('*')
//       .eq('organization_id', organization.id)
//       .order('created_at', { ascending: false })

//     if (!error) setProducts(data || [])
//   }

//   useEffect(() => {
//     let isMounted = true

//     const load = async () => {
//       setLoading(true)
//       const { data, error } = await supabase
//         .from('products')
//         .select('*')
//         .eq('organization_id', organization.id)
//         .order('created_at', { ascending: false })

//       if (isMounted) {
//         if (!error) setProducts(data || [])
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
//     if (!confirm('Delete this product?')) return
//     const { error } = await supabase.from('products').delete().eq('id', id)
//     if (error) {
//       alert(error.message)
//       return
//     }
//     fetchProducts()
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold">Inventory</h1>
//         <button
//           onClick={() => {
//             setSelectedProduct(undefined)
//             setModalOpen(true)
//           }}
//           className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//         >
//           Add Product
//         </button>
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : products.length === 0 ? (
//         <div className="flex flex-col items-center py-20 text-gray-500 border-2 border-dashed rounded-xl">
//           <p>No products found</p>
//         </div>
//       ) : (
//         <>
//           {/* MOBILE VIEW: Cards */}
//           <div className="md:hidden space-y-4">
//             {products.map((p) => (
//               <div key={p.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex items-center gap-2 font-bold text-gray-900">
//                     <FiPackage className="text-green-600" />
//                     {p.name}
//                   </div>
//                   <div className="flex gap-2">
//                     <button onClick={() => { setSelectedProduct(p); setModalOpen(true) }} className="text-blue-600 p-2">
//                       <FiEdit2 size={16} />
//                     </button>
//                     {isOwnerOrAdmin && (
//                       <button onClick={() => handleDelete(p.id)} className="text-red-600 p-2">
//                         <FiTrash2 size={16} />
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-2 text-sm">
//                   <div className="bg-gray-50 p-2 rounded">
//                     <p className="text-gray-500 text-[10px] uppercase font-semibold">Sale</p>
//                     <p className="font-medium">{p.sale_price ?? '-'}</p>
//                   </div>
//                   <div className="bg-gray-50 p-2 rounded">
//                     <p className="text-gray-500 text-[10px] uppercase font-semibold">Rent</p>
//                     <p className="font-medium">{p.rental_price ?? '-'}</p>
//                   </div>
//                   <div className={`p-2 rounded ${p.low_stock_threshold != null && p.stock <= p.low_stock_threshold ? 'bg-red-50' : 'bg-gray-50'}`}>
//                     <p className="text-gray-500 text-[10px] uppercase font-semibold">Stock</p>
//                     <p className={`font-medium ${p.low_stock_threshold != null && p.stock <= p.low_stock_threshold ? 'text-red-600' : ''}`}>
//                       {p.stock}
//                     </p>
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
//                   <th className="p-4 text-left font-medium text-gray-500">Name</th>
//                   <th className="p-4 text-left font-medium text-gray-500">Sale Price</th>
//                   <th className="p-4 text-left font-medium text-gray-500">Rental Price</th>
//                   <th className="p-4 text-left font-medium text-gray-500">Stock</th>
//                   <th className="p-4 text-left font-medium text-gray-500">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((p) => {
//                   const lowStock = p.low_stock_threshold != null && p.stock <= p.low_stock_threshold
//                   return (
//                     <tr key={p.id} className="border-t hover:bg-gray-50 transition">
//                       <td className="p-4 font-medium text-gray-900">{p.name}</td>
//                       <td className="p-4 text-gray-600">{p.sale_price ?? '-'}</td>
//                       <td className="p-4 text-gray-600">{p.rental_price ?? '-'}</td>
//                       <td className={`p-4 ${lowStock ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
//                         {p.stock}
//                         {lowStock && <span className="ml-2 text-[10px] uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Low</span>}
//                       </td>
//                       <td className="p-4 flex gap-3">
//                         <button onClick={() => { setSelectedProduct(p); setModalOpen(true) }} className="text-blue-600 hover:text-blue-800">
//                           Edit
//                         </button>
//                         {isOwnerOrAdmin && (
//                           <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">
//                             Delete
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}

//       {modalOpen && (
//         <ProductModal
//           product={selectedProduct}
//           onClose={() => setModalOpen(false)}
//           onSuccess={() => {
//             setModalOpen(false)
//             fetchProducts()
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
import ProductModal from './components/ProductModal'
import { FiEdit2, FiTrash2, FiPackage, FiSearch } from 'react-icons/fi'
import type { Product } from '@/lib/supabase/database.types'
import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { Badge } from '@/app/components/ui/Badge'
import { EmptyState } from '@/app/components/ui/EmptyState'
import { SkeletonRow, SkeletonCard } from '@/app/components/ui/Skeleton'
import { Pagination } from '@/app/components/ui/Pagination'
import { usePagination } from '@/app/components/ui/usePagination'
import { useConfirm } from '@/app/components/ui/useConfirm'
import { useToast } from '@/app/components/ui/Toast'
import { formatCurrency } from '@/lib/format'

export default function InventoryPage() {
  const supabase = getSupabaseClient()
  const { organization, isOwnerOrAdmin } = useOrganization()
  const toast = useToast()
  const { confirm, dialog: confirmDialog } = useConfirm()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('organization_id', organization.id)
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
        .eq('organization_id', organization.id)
        .order('created_at', { ascending: false })

      if (isMounted) {
        if (!error) setProducts(data || [])
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
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)
    )
  }, [products, search])

  const { page, setPage, pageCount, pageItems, totalItems, pageSize } = usePagination(filtered, 10)

  const handleDelete = async (product: Product) => {
    const ok = await confirm({
      title: `Delete ${product.name}?`,
      description: 'This cannot be undone.',
      confirmLabel: 'Delete',
      tone: 'danger',
    })
    if (!ok) return

    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Product deleted')
    fetchProducts()
  }

  return (
    <div className="space-y-6">
      {confirmDialog}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-dark">Inventory</h1>
        <Button
          onClick={() => {
            setSelectedProduct(undefined)
            setModalOpen(true)
          }}
        >
          Add Product
        </Button>
      </div>

      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or SKU..."
          className="pl-9"
        />
      </div>

      {loading ? (
        <>
          <div className="md:hidden space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <table className="hidden md:table w-full text-sm bg-white border border-border rounded-xl overflow-hidden">
            <tbody>{Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} columns={5} />)}</tbody>
          </table>
        </>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FiPackage size={28} />}
          title={products.length === 0 ? 'No products yet' : 'No products match your search'}
          description={
            products.length === 0
              ? 'Add your first product to start building invoices.'
              : undefined
          }
          action={
            products.length === 0 ? (
              <Button onClick={() => setModalOpen(true)}>Add Product</Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* MOBILE VIEW: Cards */}
          <div className="md:hidden space-y-4">
            {pageItems.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-xl border border-border shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 font-bold text-dark">
                    <FiPackage className="text-deepgreen" />
                    {p.name}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedProduct(p); setModalOpen(true) }} className="text-blue-600 p-2 cursor-pointer">
                      <FiEdit2 size={16} />
                    </button>
                    {isOwnerOrAdmin && (
                      <button onClick={() => handleDelete(p)} className="text-red-600 p-2 cursor-pointer">
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-primary-soft p-2 rounded-lg">
                    <p className="text-deepgreen/70 text-[10px] uppercase font-semibold">Sale</p>
                    <p className="font-mono font-medium text-dark">{p.sale_price ?? '—'}</p>
                  </div>
                  <div className="bg-rental-soft p-2 rounded-lg">
                    <p className="text-rental/80 text-[10px] uppercase font-semibold">Rent</p>
                    <p className="font-mono font-medium text-dark">{p.rental_price ?? '—'}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${p.low_stock_threshold != null && p.stock <= p.low_stock_threshold ? 'bg-red-50' : 'bg-gray-50'}`}>
                    <p className="text-muted text-[10px] uppercase font-semibold">Stock</p>
                    <p className={`font-mono font-medium ${p.low_stock_threshold != null && p.stock <= p.low_stock_threshold ? 'text-red-600' : 'text-dark'}`}>
                      {p.stock}
                    </p>
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
                  <th className="p-4 text-left font-medium text-muted">Name</th>
                  <th className="p-4 text-left font-medium text-muted">Sale Price</th>
                  <th className="p-4 text-left font-medium text-muted">Rental Price</th>
                  <th className="p-4 text-left font-medium text-muted">Stock</th>
                  <th className="p-4 text-left font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((p) => {
                  const lowStock = p.low_stock_threshold != null && p.stock <= p.low_stock_threshold
                  return (
                    <tr key={p.id} className="border-t border-border hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-dark">
                        {p.name}
                        {p.sku && <span className="ml-2 text-xs text-muted font-mono">{p.sku}</span>}
                      </td>
                      <td className="p-4 font-mono text-dark">{p.sale_price != null ? formatCurrency(p.sale_price, organization.currency) : '—'}</td>
                      <td className="p-4 font-mono text-dark">{p.rental_price != null ? formatCurrency(p.rental_price, organization.currency) : '—'}</td>
                      <td className="p-4">
                        <span className={`font-mono ${lowStock ? 'text-red-600 font-medium' : 'text-dark'}`}>{p.stock}</span>
                        {lowStock && <Badge tone="danger" className="ml-2">Low</Badge>}
                      </td>
                      <td className="p-4 flex gap-3">
                        <button onClick={() => { setSelectedProduct(p); setModalOpen(true) }} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                          Edit
                        </button>
                        {isOwnerOrAdmin && (
                          <button onClick={() => handleDelete(p)} className="text-red-600 hover:text-red-800 cursor-pointer">
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} totalItems={totalItems} pageSize={pageSize} />
        </>
      )}

      {modalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false)
            fetchProducts()
            toast.success(selectedProduct ? 'Product updated' : 'Product added')
          }}
        />
      )}
    </div>
  )
}
