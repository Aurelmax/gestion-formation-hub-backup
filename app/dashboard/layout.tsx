import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Barre latérale */}
        <DashboardSidebar />

        {/* Contenu principal */}
        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}