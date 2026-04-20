'use client'

import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import Sidebar from './Sidebar'

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

    return (
    <>
      <button
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <FiMenu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="relative z-50">
            <Sidebar />
          </div>

          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setOpen(false)}
          >
            <FiX size={24} />
          </button>
        </div>
      )}
    </>
  )
}