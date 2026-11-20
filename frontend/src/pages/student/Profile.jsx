import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, BookOpen, GraduationCap, Calendar, Users, Edit3, X, Check } from 'lucide-react'
import api from '../../api/axiosConfig'
import Loading from '../../components/common/Loading'
import toast from 'react-hot-toast'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    api.get('/student/profile').then(r => {
      setProfile(r.data); setPhone(r.data.phone || ''); setAddress(r.data.address || '')
    }).catch(() => toast.error('Failed to load profile')).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/student/profile', { phone, address })
      setProfile(p => ({ ...p, phone, address }))
      toast.success('Profile updated'); setEditing(false)
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
    finally { setSaving(false) }
  }

  if (loading) return <Loading />

  const initials = profile?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      {/* Hero card */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white/30 flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{profile?.fullName}</h2>
              <p className="text-blue-100 text-sm">{profile?.program} &bull; Sem {profile?.semester}</p>
            </div>
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold border border-white/30">
                Active Student
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">Academic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { icon: GraduationCap, label: 'Department', value: profile?.departmentName, color: 'text-blue-600 bg-blue-50' },
                { icon: BookOpen,      label: 'Program',    value: profile?.program,        color: 'text-indigo-600 bg-indigo-50' },
                { icon: Users,         label: 'Semester',   value: profile?.semester ? `Semester ${profile.semester}` : '—', color: 'text-purple-600 bg-purple-50' },
                { icon: Calendar,      label: 'Date of Birth', value: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—', color: 'text-pink-600 bg-pink-50' },
                { icon: Users,         label: 'Gender',     value: profile?.gender,         color: 'text-teal-600 bg-teal-50' },
                { icon: Mail,          label: 'Email',      value: profile?.email,          color: 'text-orange-600 bg-orange-50' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact Details</h3>
              {!editing
                ? <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                    <Edit3 size={13} /> Edit
                  </button>
                : <div className="flex gap-2">
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg disabled:opacity-60 transition-colors">
                      <Check size={13} /> {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <X size={13} /> Cancel
                    </button>
                  </div>
              }
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={15} />
                    <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Phone</p>
                    <p className="text-sm font-semibold text-gray-800">{profile?.phone || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Address</p>
                    <p className="text-sm font-semibold text-gray-800">{profile?.address || '—'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: ID card style */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-4">Digital Student Card</p>
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-white text-xl font-bold mb-3">
              {initials}
            </div>
            <p className="font-bold text-lg leading-tight">{profile?.fullName}</p>
            <p className="text-blue-200 text-xs mt-1">{profile?.rollNumber}</p>

            <div className="mt-5 space-y-2.5">
              {[
                ['Program', profile?.program],
                ['Department', profile?.departmentName],
                ['Semester', profile?.semester ? `Semester ${profile.semester}` : '—'],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-blue-300">{label}</span>
                  <span className="font-medium text-white text-right max-w-[55%] truncate">{val || '—'}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/20">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-400/20 text-green-300 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
