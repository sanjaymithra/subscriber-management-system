import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '../components/navigation/Navbar'
import { Sidebar } from '../components/navigation/Sidebar'
import { NAV_ITEMS } from '../constants/navigation'

export function DashboardLayout() {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const activeItem = NAV_ITEMS.find((item) => item.path === location.pathname)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-on-background/30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        />
      )}
      <div className="flex min-h-screen flex-col md:ml-60">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} title={activeItem?.label} />
        <Outlet />
      </div>
    </div>
  )
}
