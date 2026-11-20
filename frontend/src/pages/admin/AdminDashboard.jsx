import { useEffect, useState } from 'react'
import { GraduationCap, Users, BookOpen, Building2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../../api/axiosConfig'
import StatCard from '../../components/common/StatCard'
import Loading from '../../components/common/Loading'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Campus overview and statistics</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={stats?.totalStudents} icon={GraduationCap} color="blue" />
        <StatCard title="Total Faculty" value={stats?.totalFaculty} icon={Users} color="green" />
        <StatCard title="Total Courses" value={stats?.totalCourses} icon={BookOpen} color="yellow" />
        <StatCard title="Departments" value={stats?.totalDepartments} icon={Building2} color="purple" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Department bar chart */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Department-wise Students</h3>
          {stats?.departmentStats?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.departmentStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No data available</div>
          )}
        </div>

        {/* Pie chart */}
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Student Distribution</h3>
          {stats?.departmentStats?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.departmentStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="students"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {stats.departmentStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No data available</div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Student', href: '/admin/students', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
            { label: 'Add Faculty', href: '/admin/faculty', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
            { label: 'Add Course', href: '/admin/courses', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
            { label: 'Post Notice', href: '/admin/announcements', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
          ].map(action => (
            <a key={action.label} href={action.href}
               className={`rounded-lg p-3 text-sm font-medium text-center transition-colors ${action.color}`}>
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
