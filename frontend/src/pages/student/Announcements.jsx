import { useEffect, useState } from 'react'
import { Megaphone } from 'lucide-react'
import api from '../../api/axiosConfig'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'

const AUDIENCE_COLORS = { ALL: 'badge-blue', STUDENTS: 'badge-green', FACULTY: 'badge-yellow' }

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/student/announcements').then(r => setAnnouncements(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
      {announcements.length === 0 ? (
        <div className="card"><EmptyState title="No announcements" /></div>
      ) : announcements.map(a => (
        <div key={a.id} className="card hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-50 rounded-lg flex-shrink-0">
              <Megaphone className="text-primary-600" size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-semibold text-gray-900">{a.title}</h3>
                <span className={AUDIENCE_COLORS[a.audience] || 'badge-blue'}>{a.audience}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1.5">{a.content}</p>
              <p className="text-xs text-gray-400 mt-2">By {a.postedBy} · {a.postedAt ? new Date(a.postedAt).toLocaleDateString() : ''}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
