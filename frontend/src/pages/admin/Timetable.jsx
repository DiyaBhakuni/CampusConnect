import { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'
import toast from 'react-hot-toast'
import DataTable from '../../components/common/DataTable'
import Loading from '../../components/common/Loading'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

function TimetableModal({ entry, courses, faculty, onClose, onSaved }) {
  const isEdit = !!entry?.id
  const [form, setForm] = useState(entry || { courseId: '', facultyId: '', dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '10:00', academicYear: '2024-25', semesterLabel: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEdit) await api.put(`/admin/timetable/${entry.id}`, form)
      else await api.post('/admin/timetable', form)
      toast.success(`Timetable entry ${isEdit ? 'updated' : 'created'}`)
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{isEdit ? 'Edit Entry' : 'Add Timetable Entry'}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
            <select className="input-field" value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})} required>
              <option value="">Select course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.courseCode} — {c.courseName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
            <select className="input-field" value={form.facultyId || ''} onChange={e => setForm({...form, facultyId: e.target.value || null})}>
              <option value="">Select faculty</option>
              {faculty.map(f => <option key={f.id} value={f.id}>{f.fullName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Day *</label>
            <select className="input-field" value={form.dayOfWeek} onChange={e => setForm({...form, dayOfWeek: e.target.value})} required>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
              <input type="time" className="input-field" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
              <input type="time" className="input-field" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
            <input className="input-field" value={form.academicYear} onChange={e => setForm({...form, academicYear: e.target.value})} placeholder="e.g. 2024-25" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <input className="input-field" value={form.semesterLabel} onChange={e => setForm({...form, semesterLabel: e.target.value})} placeholder="e.g. Semester 3" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="btn-secondary text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary text-sm">{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminTimetable() {
  const [data, setData] = useState([])
  const [courses, setCourses] = useState([])
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const load = () => {
    setLoading(true)
    Promise.all([
      api.get('/admin/timetable'),
      api.get('/admin/courses'),
      api.get('/admin/faculty'),
    ]).then(([tt, c, f]) => {
      setData(tt.data)
      setCourses(c.data)
      setFaculty(f.data)
    }).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const deleteEntry = async (id) => {
    try {
      await api.delete(`/admin/timetable/${id}`)
      toast.success('Entry deleted')
      load()
    } catch (err) { toast.error('Delete failed') }
  }

  const columns = [
    { key: 'dayOfWeek', label: 'Day' },
    { key: 'startTime', label: 'Start' },
    { key: 'endTime', label: 'End' },
    { key: 'courseCode', label: 'Course' },
    { key: 'courseName', label: 'Course Name' },
    { key: 'facultyName', label: 'Faculty' },
    { key: 'semesterLabel', label: 'Semester' },
    { key: '_actions', label: 'Actions', render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={() => setModal(row)} className="text-blue-600 hover:text-blue-800"><Pencil size={15} /></button>
        <button onClick={() => setConfirm(row.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-500 text-sm mt-1">Manage class schedules</p>
        </div>
        <button onClick={() => setModal({})} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />Add Entry
        </button>
      </div>

      <div className="card">
        {loading ? <Loading /> : <DataTable columns={columns} data={data} />}
      </div>

      {modal !== null && (
        <TimetableModal entry={modal} courses={courses} faculty={faculty}
          onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />
      )}

      <ConfirmDialog open={confirm !== null} title="Delete Entry" message="Delete this timetable entry?"
        onConfirm={() => { deleteEntry(confirm); setConfirm(null) }}
        onCancel={() => setConfirm(null)} />
    </div>
  )
}
