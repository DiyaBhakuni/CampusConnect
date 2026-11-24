import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import Navbar from '../components/common/Navbar'
import { LayoutDashboard, BookOpen, ClipboardCheck, BarChart2, Calendar, Megaphone, PartyPopper, Bell, User, Key } from 'lucide-react'

const navItems = [
  { to: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/profile', label: 'Profile', icon: User },
  { to: '/student/courses', label: 'My Courses', icon: BookOpen },
  { to: '/student/attendance', label: 'Attendance', icon: ClipboardCheck },
  { to: '/student/marks', label: 'Marks', icon: BarChart2 },
  { to: '/student/timetable', label: 'Timetable', icon: Calendar },
  { to: '/student/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/student/events', label: 'Events', icon: PartyPopper },
  { to: '/student/notifications', label: 'Notifications', icon: Bell },
  { to: '/student/change-password', label: 'Change Password', icon: Key },
]

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const rawTitle = navItems.find(n => n.to === pathname)?.label ?? 'Student'
  const title = pathname === '/student' ? null : rawTitle

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
