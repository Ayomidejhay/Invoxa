// import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
// import Sidebar from './components/layout/Sidebar'
// import Topbar from './components/layout/Topbar'
// import { SidebarProvider } from './context/SidebarContext'
// import { MainContent } from './context/MainContext'

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const supabase = await createClient()

//   const {
//     data: { session },
//   } = await supabase.auth.getSession()

//   if (!session) {
//     redirect('/')
//   }

//    return (
//     <SidebarProvider>
//       <div className="flex h-screen bg-background">

//         <Sidebar />

//         <MainContent>
//           <Topbar user={session.user} />

//           <main className="flex-1 bg-white p-6 overflow-y-auto">
//             {children}
//           </main>

//         </MainContent>

//       </div>
//     </SidebarProvider>
//   )
// }

import { requireOrgContext } from '@/lib/supabase/organization'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import { OrganizationProvider } from './components/OrganizationProvider'
import { SidebarProvider } from './context/SidebarContext'
import { MainContent } from './context/MainContext'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Single source of truth for "is this user logged in AND part of an org".
  // Redirects to /login or /onboarding internally as needed — if we get
  // past this line, profile + organization are guaranteed to exist.
  const { user, profile, organization } = await requireOrgContext()

  return (
    <OrganizationProvider profile={profile} organization={organization}>
      <SidebarProvider>
        <div className="flex h-screen bg-[#121214] text-white dark">
          <Sidebar />

          <MainContent>
            <Topbar email={user.email} />

            <main className="flex-1 bg-[#1E1E1E] p-6 overflow-y-auto">
              {children}
            </main>
          </MainContent>
        </div>
      </SidebarProvider>
    </OrganizationProvider>
  )
}

