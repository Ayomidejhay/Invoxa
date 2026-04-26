// 'use client'

// import { useState } from 'react'
// import { FiMenu, FiX } from 'react-icons/fi'
// import Sidebar from './Sidebar'

// export function MobileSidebar() {
//   const [open, setOpen] = useState(false)

//     return (
//     <>
//       <button
//         className="md:hidden"
//         onClick={() => setOpen(true)}
//       >
//         <FiMenu size={22} />
//       </button>

//       {open && (
//         <div className="fixed inset-0 z-50 flex">
//           {/* Overlay */}
//           <div
//             className="absolute inset-0 bg-black/50"
//             onClick={() => setOpen(false)}
//           />

//           {/* Drawer */}
//           <div className="relative z-50">
//             <Sidebar />
//           </div>

//           <button
//             className="absolute top-4 right-4 text-white"
//             onClick={() => setOpen(false)}
//           >
//             <FiX size={24} />
//           </button>
//         </div>
//       )}
//     </>
//   )
// }

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiHome, FiUsers, FiBox, FiFileText, FiSettings } from 'react-icons/fi'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Customers', href: '/customers', icon: FiUsers },
  { name: 'Inventory', href: '/inventory', icon: FiBox },
  { name: 'Invoices', href: '/invoice', icon: FiFileText },
  { name: 'Settings', href: '/settings', icon: FiSettings },
]

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <button className="md:hidden p-2 text-gray-700" onClick={() => setIsOpen(true)}>
        <FiMenu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 z-50 h-full w-[280px] bg-white shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl font-bold">Invoxa</h1>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                  <FiX size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                        pathname === item.href 
                          ? 'bg-green-600 text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}