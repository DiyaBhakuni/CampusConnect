import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axiosConfig'
import DataTable from '../../components/common/DataTable'

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([])
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCourse, setFilterCourse] = useState('')
  const [form, setForm] = useState({ studentId: '', courseId: '' })
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [e, s, c] = await Promise.all([api.get('/admin/enrollments'), api.get('/admin/students'), api.get('/admin/courses')])
      setEnrollments(e.data); setStudents(s.data); setCourses(c.data)
    } catch { toast.error('Failed to load data') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = filterCourse ? enrollments.filter(e => String(e.courseId) === filterCourse) : enrollments

  const handleEnroll = async () => {
    if (!form.studentId || !form.courseId) { toast.error('Select both student and course'); return }
    setSaving(true)
    try {
      await api.post('/admin/enrollments', { studentId: Number(form.studentId), courseId: Number(form.courseId) })
      toast.success('Student enrolled'); setForm({ studentId: '', courseId: '' }); fetchData()
    } catch (err) { toast.error(err.response?.data?.message || 'Enrollment failed') }
    finally { setSaving(false) }
  }

  const columns = [
    { key: 'studentName', label: 'Student' },
    { key: 'rollNumber', label: 'Roll No.' },
    { key: 'courseCode', label: 'Course Code' },
    { key: 'courseName', label: 'Course Name' },
    { key: 'enrolledAt', label: 'Enrolled On', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'active', label: 'Status', render: (v) => v ? <span className="badge-green">Active</span> : <span className="badge-red">Inactive</span> },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>

      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Enroll Student</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-gray-600">Student</label>
            <select value={form.studentId} onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))} className="input-field text-sm mt-0.5 min-w-[200px]">
              <option value="">Select student...</option>
              {students.filter(s => s.active).map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.rollNumber})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600">Course</label>
            <select value={form.courseId} onChange={e => setForm(p => ({ ...p, courseId: e.target.value }))} className="input-field text-sm mt-0.5 min-w-[200px]">
              <option value="">Select course...</option>
              {courses.filter(c => c.active).map(c => <option key={c.id} value={c.id}>{c.courseCode} - {c.courseName}</option>)}
            </select>
          </div>
          <button onClick={handleEnroll} disabled={saving} className="btn-primary text-sm flex items-center gap-1">
            <Plus size={14} />{saving ? 'Enrolling...' : 'Enroll'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <label className="text-xs text-gray-600">Filter by course:</label>
          <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} className="input-field text-sm max-w-xs">
            <option value="">All courses</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.courseCode} - {c.courseName}</option>)}
          </select>
          <span className="text-sm text-gray-500">{filtered.length} records</span>
        </div>
        <DataTable columns={columns} data={filtered} loading={loading} />
      </div>
    </div>
  )
}
