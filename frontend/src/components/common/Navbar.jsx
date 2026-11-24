import { useState } from 'react'
import { Menu, Bell, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ onMenuClick, title }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  const roleBase = () => {
    if (user?.role === 'ROLE_ADMIN') return '/admin'
    if (user?.role === 'ROLE_FACULTY') return '/faculty'
    return '/student'
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`${roleBase()}/directory?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-4">
      <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-gray-700 flex-shrink-0">
        <Menu size={22} />
      </button>

      {/* Logo — top left like reference */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <img src="/logo.png" alt="Quantara University" className="h-10 w-auto" />
        <div className="hidden sm:block leading-tight">
          <p className="text-navy-800 font-bold text-sm" style={{ color: '#1a2e5a' }}>Quantara University</p>
          <p className="text-gray-500 text-xs">(Deemed to be University)</p>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-10 bg-gray-200 flex-shrink-0" />

      {/* Page title or University name on dashboard */}
      {title ? (
        <h2 className="text-gray-700 font-semibold text-sm hidden md:block flex-shrink-0">{title}</h2>
      ) : (
        <div className="hidden md:block flex-shrink-0">
          <p className="text-sm font-bold" style={{ color: '#1a2e5a' }}>Quantara University</p>
          <p className="text-xs text-gray-500">
            {user?.role === 'ROLE_FACULTY' ? 'Faculty Portal' : user?.role === 'ROLE_ADMIN' ? 'Admin Portal' : 'Student Portal'}
          </p>
        </div>
      )}

      <form onSubmit={handleSearch} className="flex-1 max-w-sm ml-auto flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search students, courses..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </form>

      <button onClick={() => navigate(`${roleBase()}/notifications`)} className="relative text-gray-500 hover:text-gray-700 flex-shrink-0">
        <Bell size={20} />
      </button>
    </header>
  )
}
