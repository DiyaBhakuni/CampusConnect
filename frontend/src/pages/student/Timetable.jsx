import { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']

export default function StudentTimetable() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/student/timetable').then(r => setEntries(r.data)).catch(() => toast.error('Failed to load timetable')).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  const grouped = DAYS.reduce((acc, day) => {
    acc[day] = entries.filter(e => e.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime))
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Weekly Timetable</h1>

      {entries.length === 0 ? (
        <div className="card"><EmptyState title="No timetable available" /></div>
      ) : (
        <div className="card overflow-x-auto">
          <div className="grid grid-cols-5 gap-3 min-w-[640px]">
            {DAYS.map(day => (
              <div key={day}>
                <div className="text-xs font-semibold text-gray-600 bg-primary-50 text-primary-700 px-2 py-2 rounded text-center mb-2">
                  {day.charAt(0) + day.slice(1).toLowerCase()}
                </div>
                <div className="space-y-2">
                  {grouped[day].length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">Free</p>
                  ) : grouped[day].map(e => (
                    <div key={e.id} className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-xs font-bold text-primary-700">{e.courseCode}</p>
                      <p className="text-xs text-gray-600 truncate">{e.courseName}</p>
                      <p className="text-xs text-gray-500 mt-1">{e.startTime}–{e.endTime}</p>
                      {e.facultyName && <p className="text-xs text-gray-400">{e.facultyName}</p>}
                      {e.roomNumber && <p className="text-xs text-gray-400">{e.roomNumber}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
