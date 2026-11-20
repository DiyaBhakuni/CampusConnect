import { useState, useEffect, useCallback } from 'react'
import api from '../../api/axiosConfig'
import DataTable from '../../components/common/DataTable'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'

export default function FacultyStudents() {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [coursesLoading, setCoursesLoading] = useState(true)

  useEffect(() => {
    api.get('/faculty/my-courses')
      .then(r => { setCourses(r.data); if (r.data.length > 0) setSelectedCourse(String(r.data[0].id)) })
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setCoursesLoading(false))
  }, [])

  const fetchStudents = useCallback(async (courseId) => {
    if (!courseId) return
    setLoading(true)
    try { const r = await api.get(`/faculty/courses/${courseId}/students`); setStudents(r.data) }
    catch { toast.error('Failed to load students') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { if (selectedCourse) fetchStudents(selectedCourse) }, [selectedCourse, fetchStudents])

  const columns = [
    { key: 'rollNumber', label: 'Roll No.' },
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'program', label: 'Program' },
    { key: 'semester', label: 'Semester' },
    { key: 'phone', label: 'Phone' },
  ]

  if (coursesLoading) return <Loading />

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Students by Course</h1>
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-medium text-gray-700">Select Course:</label>
          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="input-field text-sm max-w-xs">
            {courses.map(c => <option key={c.id} value={c.id}>{c.courseCode} – {c.courseName}</option>)}
          </select>
          {students.length > 0 && <span className="text-sm text-gray-500">{students.length} students enrolled</span>}
        </div>
        {selectedCourse ? <DataTable columns={columns} data={students} loading={loading} /> : <EmptyState title="Select a course" />}
      </div>
    </div>
  )
}
