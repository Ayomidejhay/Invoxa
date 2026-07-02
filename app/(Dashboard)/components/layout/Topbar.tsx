

// 'use client'

// import { useRouter } from 'next/navigation'
// import { getSupabaseClient } from '@/lib/supabase/client'
// import { useOrganization } from '../OrganizationProvider'
// import { MobileSidebar } from './MobileSidebar'

// export default function Topbar({ email }: { email: string | null }) {
//   const router = useRouter()
//   const { organization, profile } = useOrganization()
//   const supabase = getSupabaseClient()

//   const handleLogout = async () => {
//     await supabase.auth.signOut()
//     router.push('/login')
//   }

//   return (
//     <div className="bg-light border-b flex items-center justify-between p-6 print:hidden">
//       <div className="flex items-center gap-4">
//         <MobileSidebar />
//         <div>
//           <h2 className="font-semibold leading-tight">{organization.name}</h2>
//           <span className="text-xs text-gray-500 capitalize">{profile.role}</span>
//         </div>
//       </div>

//       <div className="flex items-center gap-4">
//         <span className="hidden sm:block text-sm text-gray-600">
//           {email}
//         </span>
//         <button
//           onClick={handleLogout}
//           className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   )
// }


'use client'

import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useOrganization } from '../OrganizationProvider'
import { MobileSidebar } from './MobileSidebar'
import { Button } from '@/app/components/ui/Button'
import { useTheme } from '@/app/context/ThemeContext'
import { FiSun, FiMoon } from 'react-icons/fi'

export default function Topbar({ email }: { email: string | null }) {
  const router = useRouter()
  const { organization, profile } = useOrganization()
  const supabase = getSupabaseClient()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="bg-white dark:bg-[#1E1E1E] border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between p-6 print:hidden transition-colors duration-200">
      <div className="flex items-center gap-4">
        <MobileSidebar />
        <div>
          <h2 className="font-semibold leading-tight text-dark dark:text-white transition-colors duration-200">{organization.name}</h2>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">{profile.role}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:block text-sm text-zinc-650 dark:text-zinc-400 transition-colors duration-200">
          {email}
        </span>
        <button
          onClick={toggleTheme}
          className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer mr-1"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  )
}
