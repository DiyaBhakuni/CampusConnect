import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from '../../api/axiosConfig'
import Loading from '../../components/common/Loading'
import DataTable from '../../components/common/DataTable'
import EmptyState from '../../components/common/EmptyState'

const STATUS_CYCLE = { PRESENT: 'ABSENT', ABSENT: 'PRESENT' }
const STATUS_COLOR = { PRESENT: 'badge-green', ABSENT: 'badge-red' }

export default function Attendance() {
  const [tab, setTab] = useState('mark')
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [enrollments, setEnrollments] = useState([])
  const [statusMap, setStatusMap] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState([])
  const [viewCourse, setViewCourse] = useState('')

  useEffect(() => {
    api.get('/faculty/my-courses').then(r => {
      setCourses(r.data)
      if (r.data.length > 0) { setSelectedCourse(String(r.data[0].id)); setViewCourse(String(r.data[0].id)) }
    }).catch(() => toast.error('Failed to load courses'))
  }, [])

  const fetchEnrollments = useCallback(async (courseId) => {
    if (!courseId) return
    setLoading(true)
    try {
      const r = await api.get(`/faculty/courses/${courseId}/students`)
      setEnrollments(r.data)
      const map = {}
      r.data.forEach(s => { map[s.id] = { status: 'PRESENT', enrollmentId: null } })
      setStatusMap(map)
    } catch { toast.error('Failed to load students') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { if (selectedCourse && tab === 'mark') fetchEnrollments(selectedCourse) }, [selectedCourse, tab])

  const fetchRecords = useCallback(async (courseId) => {
    if (!courseId) return
    setLoading(true)
    try { const r = await api.get(`/faculty/attendance?courseId=${courseId}`); setRecords(r.data) }
    catch { toast.error('Failed to load records') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { if (viewCourse && tab === 'view') fetchRecords(viewCourse) }, [viewCourse, tab])

  const toggleStatus = (studentId) => {
    setStatusMap(p => ({ ...p, [studentId]: { ...p[studentId], status: STATUS_CYCLE[p[studentId]?.status || 'PRESENT'] } }))
  }

  const handleSubmit = async () => {
    if (!selectedCourse || !date) { toast.error('Select course and date'); return }
    if (new Date(date) > new Date()) { toast.error('Date cannot be in the future'); return }
    setSubmitting(true)
    let success = 0, errors = 0
    for (const student of enrollments) {
      try {
        await api.post('/faculty/attendance', {
          enrollmentId: student.enrollmentId || null,
          attendanceDate: date,
          status: statusMap[student.id]?.status || 'PRESENT'
        })
        success++
      } catch { errors++ }
    }
    toast.success(`Marked ${success} attendance records${errors ? `, ${errors} failed` : ''}`)
    setSubmitting(false)
  }

  const recordCols = [
    { key: 'studentName', label: 'Student' },
    { key: 'rollNumber', label: 'Roll No.' },
    { key: 'attendanceDate', label: 'Date', render: v => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'status', label: 'Status', render: v => <span className={STATUS_COLOR[v] || 'badge-blue'}>{v}</span> },
    { key: 'remarks', label: 'Remarks' },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>

      <div className="flex gap-1 border-b border-gray-200">
        {[['mark', 'Mark Attendance'], ['view', 'View Records']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`px-4 py-2 text-sm font-medium transition-colors ${tab === key ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>{label}</button>
        ))}
      </div>

      {tab === 'mark' && (
        <div className="card space-y-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs font-medium text-gray-700">Course</label>
              <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="input-field text-sm mt-0.5 min-w-[200px]">
                {courses.map(c => <option key={c.id} value={c.id}>{c.courseCode} – {c.courseName}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Date</label>
              <input type="date" value={date} max={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} className="input-field text-sm mt-0.5" />
            </div>
          </div>

          {loading ? <Loading /> : enrollments.length === 0 ? <EmptyState title="No students enrolled" /> : (
            <>
              <p className="text-xs text-gray-500">Click status to toggle: PRESENT → ABSENT → LATE</p>
              <div className="space-y-2">
                {enrollments.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{s.fullName}</p>
                      <p className="text-xs text-gray-500">{s.rollNumber}</p>
                    </div>
                    <button onClick={() => toggleStatus(s.id)} className={`${STATUS_COLOR[statusMap[s.id]?.status || 'PRESENT']} cursor-pointer select-none`}>
                      {statusMap[s.id]?.status || 'PRESENT'}
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button onClick={handleSubmit} disabled={submitting} className="btn-primary">{submitting ? 'Submitting...' : 'Submit Attendance'}</button>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'view' && (
        <div className="card space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-gray-700">Course:</label>
            <select value={viewCourse} onChange={e => setViewCourse(e.target.value)} className="input-field text-sm max-w-xs">
              {courses.map(c => <option key={c.id} value={c.id}>{c.courseCode} – {c.courseName}</option>)}
            </select>
          </div>
          <DataTable columns={recordCols} data={records} loading={loading} />
        </div>
      )}
    </div>
  )
}
