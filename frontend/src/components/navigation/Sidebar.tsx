import { Link, useLocation } from 'react-router-dom'
import { getCurrentDemoUser } from '../../api/authApi'
import { NAV_ITEMS } from '../../constants/navigation'
import { IconButton } from '../ui/IconButton'

type SidebarProps = {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation()
  const user = getCurrentDemoUser()
  const isActive = (path: string) => location.pathname === path

  return (
    <aside
      className={`app-sidebar ${isOpen ? 'app-sidebar-open' : ''} fixed left-0 top-0 h-full w-60 bg-surface-container-highest border-r border-outline-variant flex flex-col py-unit gap-stack-sm z-50 transition-transform duration-200`}
      data-open={isOpen}
    >
      <div className="px-container-padding py-stack-md flex items-start justify-between gap-3">
        <div>
        <h1 className="text-2xl font-bold text-primary leading-none">
          Telangana Today
        </h1>
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1 opacity-70">
          Management Portal
        </p>
        </div>
        <IconButton
          className="h-8 w-8 text-outline hover:bg-secondary-container/50 md:hidden"
          icon="close"
          label="Close navigation"
          onClick={onClose}
        />
      </div>
      <nav className="flex-1 px-unit space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 transition-colors duration-150 ease-in-out ${
              isActive(item.path)
                ? 'border-l-[3px] border-primary text-primary font-bold bg-primary-container/10'
                : 'text-on-surface-variant hover:bg-secondary-container/50'
            }`}
          >
            <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
            <span className="text-[14px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-6 py-4 mt-auto border-t border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary text-xs font-bold">
            {user.role.slice(0, 1)}
          </div>
          <div className="overflow-hidden">
            <p className="text-[12px] font-bold leading-none text-on-surface">
              {user.role === 'Staff' ? 'Staff User' : 'Admin User'}
            </p>
            <p className="text-[10px] text-outline uppercase tracking-wider mt-1">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
