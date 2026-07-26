import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ImpersonationBanner from '@/components/common/ImpersonationBanner'

export default function Layout() {
  const location = useLocation()
  const hideFooter = ['/dashboard', '/history', '/reports', '/profile'].includes(location.pathname)

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <ImpersonationBanner />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}
