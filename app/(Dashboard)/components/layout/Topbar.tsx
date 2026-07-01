

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

export default function Topbar({ email }: { email: string | null }) {
  const router = useRouter()
  const { organization, profile } = useOrganization()
  const supabase = getSupabaseClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="bg-[#1E1E1E] border-b border-zinc-800 flex items-center justify-between p-6 print:hidden">
      <div className="flex items-center gap-4">
        <MobileSidebar />
        <div>
          <h2 className="font-semibold leading-tight text-white">{organization.name}</h2>
          <span className="text-xs text-zinc-400 capitalize">{profile.role}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:block text-sm text-zinc-400">
          {email}
        </span>
        <Button size="sm" onClick={handleLogout} className="border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700">
          Logout
        </Button>
      </div>
    </div>
  )
}
