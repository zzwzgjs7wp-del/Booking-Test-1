import { AppNavbar } from '@/components/app-navbar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AppNavbar />
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </>
  )
}
