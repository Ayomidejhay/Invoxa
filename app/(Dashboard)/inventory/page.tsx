
// 'use client'

// import { useEffect, useState } from 'react'
// import { createBrowserClient } from '@supabase/ssr'
// import ProductModal from './components/ProductModal'

// interface Product {
//   id: string
//   name: string
//   description: string
//   sale_price: number | null
//   rental_price: number | null
//   stock: number
//   created_at: string
// }

// export default function InventoryPage() {
//   const supabase = createBrowserClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   )

//   const [products, setProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)
//   const [modalOpen, setModalOpen] = useState(false)
//   const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()

//   const fetchProducts = async () => {
//     const { data, error } = await supabase
//       .from('products')
//       .select('*')
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
//         .order('created_at', { ascending: false })

//       if (isMounted && !error) {
//         setProducts(data || [])
//         setLoading(false)
//       }
//     }

//     load()

//     return () => {
//       isMounted = false
//     }
//   }, [])

//   const handleDelete = async (id: string) => {
//     const confirmDelete = confirm('Delete this product?')
//     if (!confirmDelete) return

//     await supabase.from('products').delete().eq('id', id)
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
//           className="bg-deepgreen text-light px-4 py-2 rounded-lg"
//         >
//           Add Product
//         </button>
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : products.length === 0 ? (
//         <div className="flex flex-col items-center py-20 text-gray-500">
//           <p className="text-lg">No products yet</p>
//           <p className="text-sm">Add your first product</p>
//         </div>
//       ) : (
//         <div className="bg-white border rounded-xl overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="p-3 text-left">Name</th>
//                 <th className="p-3 text-left">Sale Price</th>
//                 <th className="p-3 text-left">Rental Price</th>
//                 <th className="p-3 text-left">Stock</th>
//                 <th className="p-3 text-left">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {products.map((p) => (
//                 <tr key={p.id} className="border-t">
//                   <td className="p-3">{p.name}</td>
//                   <td className="p-3">{p.sale_price ?? '-'}</td>
//                   <td className="p-3">{p.rental_price ?? '-'}</td>
//                   <td className="p-3">{p.stock}</td>

//                   <td className="p-3 flex gap-3">
//                     <button
//                       onClick={() => {
//                         setSelectedProduct(p)
//                         setModalOpen(true)
//                       }}
//                       className="text-blue-600"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => handleDelete(p.id)}
//                       className="text-red-600"
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

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import ProductModal from './components/ProductModal'
import { FiEdit2, FiTrash2, FiPackage, FiDollarSign, FiArchive, FiTrendingUp } from 'react-icons/fi'

interface Product {
  id: string
  name: string
  description: string
  sale_price: number | null
  rental_price: number | null
  stock: number
  created_at: string
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()

  // const fetchProducts = async () => {
  //   const { data, error } = await supabase
  //     .from('products')
  //     .select('*')
  //     .order('created_at', { ascending: false })

  //   if (!error) setProducts(data || [])
  //   setLoading(false)
  // }

  // useEffect(() => {
  //   fetchProducts()
  // }, [])

  // const handleDelete = async (id: string) => {
  //   if (!confirm('Delete this product?')) return

  //   await supabase.from('products').delete().eq('id', id)
  //   fetchProducts()
  // }

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
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-gray-500 border-2 border-dashed rounded-xl">
          <p>No products found</p>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW: Cards */}
          <div className="md:hidden space-y-4">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    <FiPackage className="text-green-600" />
                    {p.name}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedProduct(p); setModalOpen(true); }} className="text-blue-600 p-2"><FiEdit2 size={16}/></button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 p-2"><FiTrash2 size={16}/></button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500 text-[10px] uppercase font-semibold">Sale</p>
                    <p className="font-medium">{p.sale_price ?? '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500 text-[10px] uppercase font-semibold">Rent</p>
                    <p className="font-medium">{p.rental_price ?? '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500 text-[10px] uppercase font-semibold">Stock</p>
                    <p className="font-medium">{p.stock}</p>
                  </div>
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
                  <th className="p-4 text-left font-medium text-gray-500">Sale Price</th>
                  <th className="p-4 text-left font-medium text-gray-500">Rental Price</th>
                  <th className="p-4 text-left font-medium text-gray-500">Stock</th>
                  <th className="p-4 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-900">{p.name}</td>
                    <td className="p-4 text-gray-600">{p.sale_price ?? '-'}</td>
                    <td className="p-4 text-gray-600">{p.rental_price ?? '-'}</td>
                    <td className="p-4 text-gray-600">{p.stock}</td>
                    <td className="p-4 flex gap-3">
                      <button onClick={() => { setSelectedProduct(p); setModalOpen(true); }} className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
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