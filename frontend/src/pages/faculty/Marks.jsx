import { useState, useEffect, useCallback } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axiosConfig'
import DataTable from '../../components/common/DataTable'
import Loading from '../../components/common/Loading'

const EXAM_TYPES = ['Mid-Term', 'Final', 'Assignment', 'Lab', 'Quiz']
const EMPTY_FORM = { enrollmentId: '', examType: 'Mid-Term', marksObtained: '', maxMarks: '', grade: '', remarks: '' }

export default function Marks() {
  const [tab, setTab] = useState('enter')
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [students, setStudents] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    api.get('/faculty/my-courses').then(r => {
      setCourses(r.data); if (r.data.length > 0) setSelectedCourse(String(r.data[0].id))
    }).catch(() => toast.error('Failed to load courses'))
  }, [])

  const fetchStudents = useCallback(async (courseId) => {
    if (!courseId) return
    try { const r = await api.get(`/faculty/courses/${courseId}/students`); setStudents(r.data) }
    catch { toast.error('Failed to load students') }
  }, [])

  const fetchRecords = useCallback(async (courseId) => {
    if (!courseId) return
    setLoading(true)
    try { const r = await api.get(`/faculty/marks?courseId=${courseId}`); setRecords(r.data) }
    catch { toast.error('Failed to load marks') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (selectedCourse && tab === 'enter') fetchStudents(selectedCourse)
    if (selectedCourse && tab === 'view') fetchRecords(selectedCourse)
  }, [selectedCourse, tab])

  const validate = () => {
    const e = {}
    if (!form.enrollmentId) e.enrollmentId = 'Select a student'
    if (!form.marksObtained && form.marksObtained !== 0) e.marksObtained = 'Required'
    if (!form.maxMarks && form.maxMarks !== 0) e.maxMarks = 'Required'
    if (Number(form.marksObtained) > Number(form.maxMarks)) e.marksObtained = 'Cannot exceed max marks'
    return e
  }

  const handleSave = async () => {
    const e = validate(); if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      const payload = { ...form, enrollmentId: Number(form.enrollmentId), marksObtained: Number(form.marksObtained), maxMarks: Number(form.maxMarks) }
      if (editId) { await api.put(`/faculty/marks/${editId}`, payload); toast.success('Marks updated') }
      else { await api.post('/faculty/marks', payload); toast.success('Marks saved') }
      setForm(EMPTY_FORM); setEditId(null); setErrors({}); fetchRecords(selectedCourse)
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const openEdit = (row) => {
    setTab('enter')
    setEditId(row.id)
    setForm({ enrollmentId: String(row.enrollmentId), examType: row.examType, marksObtained: String(row.marksObtained), maxMarks: String(row.maxMarks), grade: row.grade || '', remarks: row.remarks || '' })
    setErrors({})
  }

  const cols = [
    { key: 'studentName', label: 'Student' },
    { key: 'rollNumber', label: 'Roll No.' },
    { key: 'examType', label: 'Exam Type' },
    { key: 'marksObtained', label: 'Marks' },
    { key: 'maxMarks', label: 'Max' },
    { key: 'percentage', label: '%', render: v => `${v?.toFixed(1)}%` },
    { key: 'grade', label: 'Grade' },
    { key: 'actions', label: '', render: (_, row) => (
      <button onClick={() => openEdit(row)} className="text-blue-600 hover:underline text-xs">Edit</button>
    )}
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Marks</h1>
      <div className="flex gap-1 border-b border-gray-200">
        {[['enter', 'Enter Marks'], ['view', 'View Marks']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 text-sm font-medium ${tab === k ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>{l}</button>
        ))}
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700">Course:</label>
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="input-field text-sm mt-0.5 max-w-xs ml-2">
          {courses.map(c => <option key={c.id} value={c.id}>{c.courseCode} – {c.courseName}</option>)}
        </select>
      </div>

      {tab === 'enter' && (
        <div className="card space-y-3 max-w-lg">
          {editId && (
            <div className="flex items-center justify-between text-sm text-primary-600 bg-primary-50 p-2 rounded">
              <span>Editing existing marks</span>
              <button onClick={() => { setEditId(null); setForm(EMPTY_FORM) }}><X size={16} /></button>
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-gray-700">Student</label>
            <select value={form.enrollmentId} onChange={e => setForm(p => ({ ...p, enrollmentId: e.target.value }))} className={`input-field text-sm mt-0.5 ${errors.enrollmentId ? 'border-red-400' : ''}`}>
              <option value="">Select student...</option>
              {students.map(s => <option key={s.id} value={s.enrollmentId || s.id}>{s.fullName} ({s.rollNumber})</option>)}
            </select>
            {errors.enrollmentId && <p className="text-red-500 text-xs">{errors.enrollmentId}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700">Exam Type</label>
            <select value={form.examType} onChange={e => setForm(p => ({ ...p, examType: e.target.value }))} className="input-field text-sm mt-0.5">
              {EXAM_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Marks Obtained</label>
              <input type="number" min="0" value={form.marksObtained} onChange={e => setForm(p => ({ ...p, marksObtained: e.target.value }))} className={`input-field text-sm mt-0.5 ${errors.marksObtained ? 'border-red-400' : ''}`} />
              {errors.marksObtained && <p className="text-red-500 text-xs">{errors.marksObtained}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Max Marks</label>
              <input type="number" min="1" value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: e.target.value }))} className={`input-field text-sm mt-0.5 ${errors.maxMarks ? 'border-red-400' : ''}`} />
              {errors.maxMarks && <p className="text-red-500 text-xs">{errors.maxMarks}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Grade (optional)</label>
              <input value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))} className="input-field text-sm mt-0.5" placeholder="A, B+, ..." />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Remarks</label>
              <input value={form.remarks} onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))} className="input-field text-sm mt-0.5" />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : editId ? 'Update' : 'Save Marks'}</button>
          </div>
        </div>
      )}

      {tab === 'view' && (
        <div className="card">
          <DataTable columns={cols} data={records} loading={loading} />
        </div>
      )}
    </div>
  )
}
