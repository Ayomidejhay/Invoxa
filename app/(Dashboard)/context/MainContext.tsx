'use client'

import { useSidebar } from './SidebarContext'

export function MainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()

  return (
    <div
      className={`flex-1 flex flex-col transition-all duration-300 ${
        collapsed ? 'md:ml-20' : 'md:ml-64'
      }`}
    >
      {children}
    </div>
  )
}