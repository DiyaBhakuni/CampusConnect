import { useState, useEffect, useCallback } from 'react'
import { BookOpen, Users, CalendarCheck } from 'lucide-react'
import api from '../../api/axiosConfig'
import StatCard from '../../components/common/StatCard'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'

export default function FacultyDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try { const r = await api.get('/faculty/dashboard'); setData(r.data) }
    catch { toast.error('Failed to load dashboard') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading) return <Loading />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {data?.facultyName || 'Faculty'}!</h1>
        <p className="text-gray-500 text-sm mt-1">Here's your teaching overview for today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Assigned Courses" value={data?.assignedCourses} icon={BookOpen} color="blue" />
        <StatCard title="Total Students" value={data?.totalStudents} icon={Users} color="green" />
        <StatCard title="Today's Classes" value={data?.todayClasses?.length} icon={CalendarCheck} color="yellow" />
      </div>

      <div className="card">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Today's Schedule</h3>
        {data?.todayClasses?.length === 0 ? (
          <EmptyState title="No classes today" description="Enjoy your free day!" />
        ) : (
          <div className="space-y-2">
            {data?.todayClasses?.map(cls => (
              <div key={cls.id} className="flex items-center gap-4 p-3 rounded-lg bg-primary-50 border border-primary-100">
                <div className="text-primary-700 font-medium text-sm w-28">{cls.startTime} – {cls.endTime}</div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{cls.courseCode} – {cls.courseName}</p>
                  <p className="text-xs text-gray-500">{cls.roomNumber || 'Room TBA'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Mark Attendance', href: '/faculty/attendance', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
            { label: 'Enter Marks', href: '/faculty/marks', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
            { label: 'View Courses', href: '/faculty/my-courses', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
          ].map(a => (
            <a key={a.label} href={a.href} className={`rounded-lg p-3 text-sm font-medium text-center transition-colors ${a.color}`}>{a.label}</a>
          ))}
        </div>
      </div>
    </div>
  )
}
