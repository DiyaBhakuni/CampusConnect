import { useState, useEffect } from 'react'
import api from '../../api/axiosConfig'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

export default function FacultyTimetable() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('grid')

  useEffect(() => {
    api.get('/faculty/timetable')
      .then(r => setEntries(r.data))
      .catch(() => toast.error('Failed to load timetable'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  const grouped = DAYS.reduce((acc, day) => {
    acc[day] = entries.filter(e => e.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime))
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Timetable</h1>
        <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')} className="btn-secondary text-xs">
          {view === 'grid' ? 'List View' : 'Grid View'}
        </button>
      </div>

      {entries.length === 0 ? <div className="card"><EmptyState title="No timetable entries" /></div> : view === 'list' ? (
        <div className="space-y-2">
          {entries.map(e => (
            <div key={e.id} className="card flex items-center gap-4">
              <span className="text-xs font-medium text-primary-700 bg-primary-50 px-2 py-1 rounded w-24 text-center">{e.dayOfWeek}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{e.courseCode} – {e.courseName}</p>
                <p className="text-xs text-gray-500">{e.startTime} – {e.endTime}{e.roomNumber ? ` · ${e.roomNumber}` : ''}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-w-[640px]">
            {DAYS.slice(0, 5).map(day => (
              <div key={day}>
                <h3 className="text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-2 rounded-t border-b border-gray-200">
                  {day.charAt(0) + day.slice(1).toLowerCase()}
                </h3>
                <div className="space-y-2 pt-2">
                  {grouped[day].length === 0 ? (
                    <p className="text-xs text-gray-400 px-2">Free</p>
                  ) : grouped[day].map(e => (
                    <div key={e.id} className="bg-primary-50 rounded p-2 border border-primary-100">
                      <p className="text-xs font-medium text-primary-800">{e.courseCode}</p>
                      <p className="text-xs text-gray-600">{e.startTime}–{e.endTime}</p>
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
