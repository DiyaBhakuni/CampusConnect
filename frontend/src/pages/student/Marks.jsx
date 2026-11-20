import { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'

export default function StudentMarks() {
  const [marks, setMarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/student/marks').then(r => setMarks(r.data)).catch(() => toast.error('Failed to load marks')).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  // group by course
  const grouped = marks.reduce((acc, m) => {
    const key = `${m.courseCode} – ${m.courseName}`
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Marks & Results</h1>

      {Object.keys(grouped).length === 0 ? (
        <div className="card"><EmptyState title="No marks available" description="Marks will appear here once your faculty enters them." /></div>
      ) : Object.entries(grouped).map(([course, courseMarks]) => {
        const avg = courseMarks.reduce((s, m) => s + (m.percentage || 0), 0) / courseMarks.length
        return (
          <div key={course} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800">{course}</h3>
              <span className={`text-sm font-bold ${avg >= 60 ? 'text-green-600' : avg >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>Avg: {avg.toFixed(1)}%</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Exam Type</th>
                    <th className="px-4 py-2 text-right text-gray-600 font-medium">Marks</th>
                    <th className="px-4 py-2 text-right text-gray-600 font-medium">Max</th>
                    <th className="px-4 py-2 text-right text-gray-600 font-medium">%</th>
                    <th className="px-4 py-2 text-left text-gray-600 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {courseMarks.map(m => (
                    <tr key={m.id} className="border-b border-gray-100">
                      <td className="px-4 py-2 font-medium">{m.examType}</td>
                      <td className="px-4 py-2 text-right">{m.marksObtained}</td>
                      <td className="px-4 py-2 text-right">{m.maxMarks}</td>
                      <td className={`px-4 py-2 text-right font-medium ${m.percentage >= 60 ? 'text-green-600' : m.percentage >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {m.percentage?.toFixed(1)}%
                      </td>
                      <td className="px-4 py-2">{m.grade || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
