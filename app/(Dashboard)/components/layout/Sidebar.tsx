// 'use client'

// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { useState } from 'react'
// import { useSidebar } from '../../context/SidebarContext'
// import { FiHome, FiUsers, FiBox, FiFileText, FiSettings, FiMenu } from 'react-icons/fi'

// const navItems = [
//   { name: 'Dashboard', href: '/dashboard', icon: FiHome },
//   { name: 'Customers', href: '/customers', icon: FiUsers },
//   { name: 'Inventory', href: '/inventory', icon: FiBox },
//   { name: 'Invoices', href: '/invoice', icon: FiFileText },
//   { name: 'Settings', href: '/settings', icon: FiSettings },
// ]

// export default function Sidebar() {
//     const pathname = usePathname()
//     const { collapsed, setCollapsed } = useSidebar()
//    return (
//     <aside
//       className={`hidden md:flex flex-col bg-dark text-light transition-all duration-300 fixed left-0 top-0 h-screen z-40 ${
//         collapsed ? 'w-20' : 'w-64'
//       }`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between p-4">
//         {!collapsed && <h1 className="text-lg font-bold">Invoxa</h1>}
//         <button onClick={() => setCollapsed(!collapsed)}>
//           <FiMenu size={20} />
//         </button>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 px-2 space-y-2 overflow-y-auto">
//         {navItems.map((item) => {
//           const isActive = pathname === item.href
//           const Icon = item.icon

//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
//                 isActive
//                   ? 'bg-deepgreen'
//                   : 'hover:bg-lightgreen hover:text-dark'
//               }`}
//             >
//               <Icon size={18} />
//               {!collapsed && <span>{item.name}</span>}
//             </Link>
//           )
//         })}
//       </nav>
//     </aside>
//   )
// }




'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from '../../context/SidebarContext'
import { FiMenu, FiHome, FiUsers, FiBox, FiFileText, FiSettings } from 'react-icons/fi'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Customers', href: '/customers', icon: FiUsers },
  { name: 'Inventory', href: '/inventory', icon: FiBox },
  { name: 'Invoices', href: '/invoice', icon: FiFileText },
  { name: 'Settings', href: '/settings', icon: FiSettings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { collapsed, setCollapsed } = useSidebar()

  return (
    <aside
      className={`hidden md:flex flex-col bg-slate-900 text-white h-screen fixed left-0 top-0 transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!collapsed && <h1 className="text-lg font-bold">Invoxa</h1>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-slate-800 rounded">
          <FiMenu size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                pathname === item.href 
                  ? 'bg-green-600' 
                  : 'hover:bg-slate-800'
              }`}
            >
              <Icon size={20} />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}