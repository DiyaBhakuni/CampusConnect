import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import Navbar from '../components/common/Navbar'
import {
  LayoutDashboard, Users, GraduationCap, Building2, BookOpen,
  ClipboardList, Calendar, Megaphone, PartyPopper, BarChart3, Key
} from 'lucide-react'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Students', icon: GraduationCap },
  { to: '/admin/faculty', label: 'Faculty', icon: Users },
  { to: '/admin/departments', label: 'Departments', icon: Building2 },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/enrollments', label: 'Enrollments', icon: ClipboardList },
  { to: '/admin/timetable', label: 'Timetable', icon: Calendar },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/events', label: 'Events', icon: PartyPopper },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/admin/change-password', label: 'Change Password', icon: Key },
]

const titles = {
  '/admin': 'Dashboard',
  '/admin/students': 'Students',
  '/admin/faculty': 'Faculty',
  '/admin/departments': 'Departments',
  '/admin/courses': 'Courses',
  '/admin/enrollments': 'Enrollments',
  '/admin/timetable': 'Timetable',
  '/admin/announcements': 'Announcements',
  '/admin/events': 'Events',
  '/admin/reports': 'Reports',
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar navItems={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={titles[pathname] ?? 'Admin'} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
