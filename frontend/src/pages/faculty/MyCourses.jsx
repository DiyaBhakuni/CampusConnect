import { useState, useEffect } from 'react'
import api from '../../api/axiosConfig'
import DataTable from '../../components/common/DataTable'
import Loading from '../../components/common/Loading'
import toast from 'react-hot-toast'

export default function MyCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/faculty/my-courses')
      .then(r => setCourses(r.data))
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    { key: 'courseCode', label: 'Code' },
    { key: 'courseName', label: 'Course Name' },
    { key: 'departmentName', label: 'Department' },
    { key: 'credits', label: 'Credits' },
    { key: 'semester', label: 'Semester' },
    { key: 'enrollmentCount', label: 'Enrolled Students' },
    { key: 'active', label: 'Status', render: v => v ? <span className="badge-green">Active</span> : <span className="badge-red">Inactive</span> },
  ]

  if (loading) return <Loading />

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
      <div className="card">
        <DataTable columns={columns} data={courses} loading={false} />
      </div>
    </div>
  )
}
