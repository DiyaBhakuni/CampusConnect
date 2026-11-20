import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { X } from 'lucide-react'

export default function Sidebar({ navItems, open, onClose }) {
  const { user, logout } = useAuth()

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />}

      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-navy-800 flex flex-col transition-transform lg:translate-x-0 lg:static lg:z-auto ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-navy-700">
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">KT Campus</h1>
            <p className="text-navy-300 text-xs">Info System</p>
          </div>
          <button onClick={onClose} className="text-gray-400 lg:hidden hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-navy-700">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm mb-2">
            {user?.fullName?.charAt(0) ?? 'U'}
          </div>
          <p className="text-white text-sm font-medium truncate">{user?.fullName}</p>
          <p className="text-navy-400 text-xs truncate">{user?.email}</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to.split('/').length === 2}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-navy-300 hover:bg-navy-700 hover:text-white'
                }`
              }
            >
              {Icon && <Icon size={18} />}
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-navy-700">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-navy-300 hover:bg-navy-700 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
