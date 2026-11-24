import { useState, useEffect, useRef } from 'react'
import { AlertTriangle, BookOpen, Calendar, Gift, X } from 'lucide-react'
import api from '../../api/axiosConfig'
import StatCard from '../../components/common/StatCard'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'

const HOLIDAYS = [
  { date: '26/01/2026', name: 'Republic Day' },
  { date: '03/03/2026 – 05/03/2026', name: 'Holi' },
  { date: '21/03/2026', name: 'Eid-Ul-Fitr' },
  { date: '26/03/2026', name: 'Ramnavmi' },
  { date: '31/03/2026', name: 'Mahavir Jayanti' },
  { date: '03/04/2026', name: 'Good Friday' },
  { date: '14/04/2026', name: 'Dr. Bhimrao Ambedkar Jayanti' },
  { date: '20/04/2026', name: 'Fest' },
  { date: '01/05/2026', name: 'Buddha Purnima' },
  { date: '20/05/2026', name: 'Demise of Former CM' },
  { date: '28/05/2026', name: 'Eid-ul-Zuha' },
  { date: '26/06/2026', name: 'Muharram' },
  { date: '15/08/2026', name: 'Independence Day' },
  { date: '18/08/2026', name: 'University Closure' },
  { date: '26/08/2026', name: 'Eid-e-Milad (Milad-un-Nabi)' },
  { date: '28/08/2026', name: 'Raksha Bandhan' },
  { date: '04/09/2026', name: 'Janmashtami' },
  { date: '23/09/2026', name: 'Ma Nanda-Sunanda' },
  { date: '02/10/2026', name: 'Gandhi Jayanti' },
  { date: '20/10/2026', name: 'Dussehra' },
  { date: '07/11/2026 – 11/11/2026', name: 'Deepawali' },
  { date: '25/12/2026', name: 'Christmas Day' },
]

export default function StudentDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // { type: 'event'|'announcement', item }
  const holidayRef = useRef(null)

  useEffect(() => {
    const el = holidayRef.current
    if (!el) return
    let frame
    const step = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        el.scrollTop = 0
      } else {
        el.scrollTop += 0.6
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    const pause = () => cancelAnimationFrame(frame)
    const resume = () => { frame = requestAnimationFrame(step) }
    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
    }
  }, [loading])

  useEffect(() => {
    api.get('/student/dashboard')
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  const attendanceColor = data?.overallAttendance >= 75 ? 'text-green-600' : 'text-red-600'

  return (
    <div className="space-y-6">

      {/* Popup Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10" onClick={e => e.stopPropagation()}>
            <button onClick={() => setModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>

            {modal.type === 'event' && (
              <>
                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center mb-4">
                  <Calendar size={18} className="text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{modal.item.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{modal.item.eventDate}{modal.item.venue ? ` · ${modal.item.venue}` : ''}</p>
                {modal.item.description && <p className="text-sm text-gray-700 leading-relaxed">{modal.item.description}</p>}
              </>
            )}

            {modal.type === 'announcement' && (
              <>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <BookOpen size={18} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{modal.item.title}</h3>
                <p className="text-xs text-gray-400 mb-4">{modal.item.postedAt ? new Date(modal.item.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
                {modal.item.content && <p className="text-sm text-gray-700 leading-relaxed">{modal.item.content}</p>}
              </>
            )}
          </div>
        </div>
      )}
      {/* Motivational quote */}
      <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-300 text-5xl font-serif leading-none select-none">"</span>
          <p className="text-gray-700 text-sm italic mt-2">You are never too old to set another goal or to dream a new dream</p>
        </div>
        <p className="text-gray-500 text-xs font-semibold whitespace-nowrap flex-shrink-0">— C.S. LEWIS</p>
      </div>

      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-700 p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold text-white mb-2">
            Welcome back, {data?.studentName?.split(' ')[0]?.toUpperCase()} ⭐
          </h2>
          <p className="text-blue-100 text-sm max-w-xl leading-relaxed mb-5">
            Your Quantara University Student Portal gives you one place to manage academics, attendance, courses, examination, announcements and student services.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              `Roll No: ${data?.rollNumber}`,
              `Program: ${data?.program || '—'}`,
              `Semester: ${data?.semester || '—'}`,
            ].map((info, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium text-white border border-white/25 bg-white/10">
                {info}
              </span>
            ))}
          </div>
        </div>

        {/* Mini Digital Student Card */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-5 min-w-[220px] flex-shrink-0">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-3">Digital Student Card</p>
          <div className="space-y-1.5 text-sm">
            {[
              ['Name', data?.studentName],
              ['Roll No', data?.rollNumber],
              ['Program', data?.program],
              ['Semester', data?.semester],
            ].map(([label, val]) => (
              <div key={label} className="flex gap-2">
                <span className="text-blue-300 font-medium min-w-[70px]">{label}:</span>
                <span className="text-white font-semibold truncate">{val || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data?.hasAttendanceAlert && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-red-700 font-medium text-sm">Attendance Alert</p>
            <p className="text-red-600 text-xs mt-0.5">You have attendance below 75% in one or more courses. Please attend classes regularly.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Overall Attendance</p>
          <p className={`text-2xl font-bold mt-1 ${attendanceColor}`}>{data?.overallAttendance?.toFixed(1)}%</p>
        </div>
        <StatCard title="Enrolled Courses" value={data?.enrolledCourses} icon={BookOpen} color="blue" />
        <StatCard title="Today's Classes" value={data?.todayClasses?.length} icon={Calendar} color="yellow" />
        <StatCard title="Notifications" value={data?.unreadNotifications} icon={null} color="purple" subtitle="Unread" />
      </div>

      {data?.attendanceSummary?.length > 0 && (
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Attendance by Course</h3>
          <div className="space-y-3">
            {data.attendanceSummary.map(s => (
              <div key={s.courseId}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{s.courseCode} – {s.courseName}</span>
                  <span className={s.belowThreshold ? 'text-red-600 font-semibold' : 'text-gray-600'}>{s.percentage?.toFixed(1)}%{s.belowThreshold ? ' ⚠️' : ''}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className={`h-2 rounded-full ${s.belowThreshold ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(s.percentage, 100)}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{s.presentCount}/{s.totalClasses} classes</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Today's Schedule</h3>
          {data?.todayClasses?.length === 0 ? <EmptyState title="No classes today" /> : (
            <div className="space-y-2">
              {data?.todayClasses?.map(cls => (
                <div key={cls.id} className="flex items-center gap-3 p-2 rounded bg-primary-50">
                  <span className="text-xs text-primary-700 font-medium w-24">{cls.startTime}–{cls.endTime}</span>
                  <span className="text-sm text-gray-800">{cls.courseCode} – {cls.courseName}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Upcoming Events</h3>
          {data?.upcomingEvents?.length === 0 ? <EmptyState title="No upcoming events" /> : (
            <div className="space-y-2">
              {data?.upcomingEvents?.map(e => (
                <div key={e.id} onClick={() => setModal({ type: 'event', item: e })}
                  className="p-2 rounded border border-gray-100 cursor-pointer hover:bg-yellow-50 hover:border-yellow-200 transition-colors">
                  <p className="text-sm font-medium text-gray-800">{e.title}</p>
                  <p className="text-xs text-gray-500">{e.eventDate} {e.venue ? `· ${e.venue}` : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Recent Announcements</h3>
          {data?.recentAnnouncements?.length === 0 ? <EmptyState title="No announcements" /> : (
            <div className="space-y-2">
              {data?.recentAnnouncements?.map(a => (
                <div key={a.id} onClick={() => setModal({ type: 'announcement', item: a })}
                  className="flex items-start justify-between p-2 rounded border border-gray-100 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <p className="text-sm text-gray-800">{a.title}</p>
                  <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">{a.postedAt ? new Date(a.postedAt).toLocaleDateString() : ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Holiday Calendar - auto scroll + manual scrollbar */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="text-orange-500" size={18} />
            <h3 className="text-base font-semibold text-gray-800">Holiday Calendar 2026</h3>
            <span className="ml-auto text-xs text-gray-400">{HOLIDAYS.length} holidays</span>
          </div>

          <div
            ref={holidayRef}
            className="h-64 overflow-y-scroll flex flex-col gap-2 pr-1"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#93c5fd #eff6ff' }}
          >
            {HOLIDAYS.map((h, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 flex-shrink-0">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Calendar size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-600">{h.date}</p>
                  <p className="text-sm font-medium text-gray-700">{h.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
