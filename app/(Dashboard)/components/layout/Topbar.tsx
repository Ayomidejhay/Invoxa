'use client'

import { User } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { MobileSidebar } from './MobileSidebar'

export default function Topbar({ user }: { user: User }) {
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className=" bg-light border-b flex items-center justify-between p-6 print:hidden">
      <div className="flex items-center gap-4">
        <MobileSidebar />
        <h2 className="font-semibold">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
         <span className="hidden sm:block text-sm text-gray-600">
          {user.email}
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green"
        >
          Logout
        </button>
      </div>
    </div>
  )
}