import { useEffect, useState, useCallback } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import api from '../../api/axiosConfig'
import { useAuth } from '../../context/AuthContext'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'

const TYPE_COLORS = {
  ATTENDANCE_ALERT: 'bg-red-50 border-red-200 text-red-800',
  MARKS_PUBLISHED: 'bg-green-50 border-green-200 text-green-800',
  ANNOUNCEMENT: 'bg-blue-50 border-blue-200 text-blue-800',
  EVENT: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  GENERAL: 'bg-gray-50 border-gray-200 text-gray-800',
}

export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    try {
      const endpoint = user?.role === 'ROLE_STUDENT' ? '/student/notifications' : '/notifications'
      const r = await api.get(endpoint)
      setNotifications(r.data)
    } catch { toast.error('Failed to load notifications') }
    finally { setLoading(false) }
  }, [user?.role])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  const markRead = async (id) => {
    if (user?.role !== 'ROLE_STUDENT') return
    try {
      await api.put(`/student/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch { toast.error('Failed to mark as read') }
  }

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read)
    for (const n of unread) { await markRead(n.id) }
    toast.success('All notifications marked as read')
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) return <Loading />

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && user?.role === 'ROLE_STUDENT' && (
          <button onClick={markAllRead} className="btn-secondary text-xs flex items-center gap-1">
            <CheckCheck size={14} />Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card"><EmptyState title="No notifications" description="You're all caught up!" /></div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`card border transition-all ${n.read ? 'opacity-70' : ''} ${TYPE_COLORS[n.type] || TYPE_COLORS.GENERAL}`}>
              <div className="flex items-start gap-3">
                <Bell size={16} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${n.read ? '' : 'font-semibold'}`}>{n.title}</p>
                    {!n.read && user?.role === 'ROLE_STUDENT' && (
                      <button onClick={() => markRead(n.id)} className="text-xs hover:underline flex-shrink-0">Mark read</button>
                    )}
                  </div>
                  {n.message && <p className="text-sm mt-0.5">{n.message}</p>}
                  <p className="text-xs mt-1 opacity-70">{n.type} · {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p>
                </div>
                {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
