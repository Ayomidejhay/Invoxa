import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import { SidebarProvider } from './context/SidebarContext'
import { MainContent } from './context/MainContext'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/')
  }

   return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">

        <Sidebar />

        <MainContent>
          <Topbar user={session.user} />

          <main className="flex-1 bg-white p-6 overflow-y-auto">
            {children}
          </main>

        </MainContent>

      </div>
    </SidebarProvider>
  )
}
