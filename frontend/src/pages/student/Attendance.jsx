import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import api from '../../api/axiosConfig'
import DataTable from '../../components/common/DataTable'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'

export default function StudentAttendance() {
  const [tab, setTab] = useState('summary')
  const [summary, setSummary] = useState([])
  const [details, setDetails] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/student/attendance/summary'), api.get('/student/attendance')])
      .then(([s, d]) => { setSummary(s.data); setDetails(d.data) })
      .catch(() => toast.error('Failed to load attendance'))
      .finally(() => setLoading(false))
  }, [])

  const detailCols = [
    { key: 'courseName', label: 'Course' },
    { key: 'attendanceDate', label: 'Date', render: v => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'status', label: 'Status', render: v => {
      const cls = v === 'PRESENT' ? 'badge-green' : v === 'ABSENT' ? 'badge-red' : 'badge-yellow'
      return <span className={cls}>{v}</span>
    }},
    { key: 'remarks', label: 'Remarks' },
  ]

  if (loading) return <Loading />

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>

      <div className="flex gap-1 border-b border-gray-200">
        {[['summary', 'Summary'], ['details', 'Detailed Records']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 text-sm font-medium ${tab === k ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>{l}</button>
        ))}
      </div>

      {tab === 'summary' && (
        <div className="space-y-4">
          {summary.filter(s => s.belowThreshold).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="text-red-500" size={18} />
              <p className="text-red-700 text-sm">You have attendance shortage in {summary.filter(s => s.belowThreshold).length} course(s). Minimum required attendance is 75%.</p>
            </div>
          )}
          {summary.length === 0 ? <div className="card"><EmptyState title="No attendance data" /></div> :
            summary.map(s => (
              <div key={s.courseId} className={`card ${s.belowThreshold ? 'border-red-200' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{s.courseCode} – {s.courseName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{s.presentCount} / {s.totalClasses} classes attended</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${s.belowThreshold ? 'text-red-600' : 'text-green-600'}`}>{s.percentage?.toFixed(1)}%</p>
                    {s.belowThreshold && <p className="text-xs text-red-500">Below 75% ⚠️</p>}
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full">
                  <div className={`h-2.5 rounded-full transition-all ${s.belowThreshold ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(s.percentage, 100)}%` }} />
                </div>
              </div>
            ))
          }
        </div>
      )}

      {tab === 'details' && (
        <div className="card">
          <DataTable columns={detailCols} data={details} loading={false} />
        </div>
      )}
    </div>
  )
}
