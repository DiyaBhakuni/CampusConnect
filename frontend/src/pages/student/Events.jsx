import { useEffect, useState } from 'react'
import { Calendar, MapPin, User } from 'lucide-react'
import api from '../../api/axiosConfig'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'

export default function StudentEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/student/events').then(r => setEvents(r.data)).catch(() => toast.error('Failed to load events')).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Campus Events</h1>
      {events.length === 0 ? (
        <div className="card"><EmptyState title="No upcoming events" description="Check back later for campus events." /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.map(e => (
            <div key={e.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Calendar className="text-yellow-600" size={18} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 flex-1">{e.title}</h3>
              </div>
              {e.description && <p className="text-sm text-gray-600 mb-3">{e.description}</p>}
              <div className="space-y-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="flex-shrink-0" />
                  <span>{new Date(e.eventDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                {e.venue && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="flex-shrink-0" />
                    <span>{e.venue}</span>
                  </div>
                )}
                {e.organizer && (
                  <div className="flex items-center gap-1.5">
                    <User size={12} className="flex-shrink-0" />
                    <span>Organized by {e.organizer}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
