import { useState, useEffect, useCallback } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../api/axiosConfig'
import Loading from '../../components/common/Loading'
import DataTable from '../../components/common/DataTable'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'

const TABS = ['Attendance', 'Enrollment', 'Analytics']

export default function Reports() {
  const [tab, setTab] = useState('Attendance')
  const [attendance, setAttendance] = useState([])
  const [enrollment, setEnrollment] = useState([])
  const [analytics, setAnalytics] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchTab = useCallback(async (t) => {
    setLoading(true)
    try {
      if (t === 'Attendance' && attendance.length === 0) {
        const r = await api.get('/admin/reports/attendance')
        setAttendance(r.data)
      } else if (t === 'Enrollment' && enrollment.length === 0) {
        const r = await api.get('/admin/reports/enrollment')
        setEnrollment(r.data)
      } else if (t === 'Analytics' && analytics.length === 0) {
        const r = await api.get('/admin/reports/analytics')
        setAnalytics(r.data)
      }
    } catch { toast.error('Failed to load report') }
    finally { setLoading(false) }
  }, [attendance.length, enrollment.length, analytics.length])

  useEffect(() => { fetchTab(tab) }, [tab])

  const attendanceCols = [
    { key: 'courseCode', label: 'Course Code' },
    { key: 'courseName', label: 'Course Name' },
    { key: 'totalClasses', label: 'Total' },
    { key: 'presentCount', label: 'Present' },
    { key: 'percentage', label: 'Percentage', render: (v, row) => (
      <span className={row.belowThreshold ? 'text-red-600 font-semibold' : 'text-green-600 font-medium'}>
        {v?.toFixed(1)}%{row.belowThreshold ? ' ⚠️' : ''}
      </span>
    )},
  ]

  const enrollmentCols = [
    { key: 'studentName', label: 'Student' },
    { key: 'rollNumber', label: 'Roll No.' },
    { key: 'courseCode', label: 'Course' },
    { key: 'courseName', label: 'Course Name' },
    { key: 'enrolledAt', label: 'Enrolled', render: v => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'active', label: 'Status', render: v => v ? <span className="badge-green">Active</span> : <span className="badge-red">Inactive</span> },
  ]

  const deptChartData = analytics.map(d => ({ name: d.name, students: d.studentCount, courses: d.courseCount }))

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? <Loading /> : (
        <div className="card">
          {tab === 'Attendance' && (
            attendance.length === 0 ? <EmptyState title="No attendance data" /> :
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  <span className="text-red-500 font-medium">{attendance.filter(a => a.belowThreshold).length}</span> students below 75% threshold
                </p>
              </div>
              <DataTable columns={attendanceCols} data={attendance} />
            </>
          )}

          {tab === 'Enrollment' && (
            enrollment.length === 0 ? <EmptyState title="No enrollment data" /> :
            <DataTable columns={enrollmentCols} data={enrollment} />
          )}

          {tab === 'Analytics' && (
            analytics.length === 0 ? <EmptyState title="No department data" /> : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Students per Department</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={deptChartData} margin={{ left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Students" />
                      <Bar dataKey="courses" fill="#10b981" radius={[4, 4, 0, 0]} name="Courses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-2 text-left text-gray-600 font-medium">Department</th>
                        <th className="px-4 py-2 text-left text-gray-600 font-medium">Code</th>
                        <th className="px-4 py-2 text-left text-gray-600 font-medium">HOD</th>
                        <th className="px-4 py-2 text-right text-gray-600 font-medium">Students</th>
                        <th className="px-4 py-2 text-right text-gray-600 font-medium">Faculty</th>
                        <th className="px-4 py-2 text-right text-gray-600 font-medium">Courses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.map(d => (
                        <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-2 font-medium">{d.name}</td>
                          <td className="px-4 py-2">{d.code}</td>
                          <td className="px-4 py-2">{d.hodName || '—'}</td>
                          <td className="px-4 py-2 text-right">{d.studentCount}</td>
                          <td className="px-4 py-2 text-right">{d.facultyCount}</td>
                          <td className="px-4 py-2 text-right">{d.courseCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
