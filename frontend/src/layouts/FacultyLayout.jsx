import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import Navbar from '../components/common/Navbar'
import { LayoutDashboard, BookOpen, Users, ClipboardCheck, BarChart2, Calendar, Key } from 'lucide-react'

const navItems = [
  { to: '/faculty', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/faculty/my-courses', label: 'My Courses', icon: BookOpen },
  { to: '/faculty/students', label: 'Students', icon: Users },
  { to: '/faculty/attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: '/faculty/marks', label: 'Marks', icon: BarChart2 },
  { to: '/faculty/timetable', label: 'Timetable', icon: Calendar },
  { to: '/faculty/change-password', label: 'Change Password', icon: Key },
]

export default function FacultyLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const rawTitle = navItems.find(n => n.to === pathname)?.label ?? 'Faculty'
  const title = pathname === '/faculty' ? null : rawTitle

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar navItems={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

