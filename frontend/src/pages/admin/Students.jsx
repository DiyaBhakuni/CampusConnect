import { useState, useEffect, useCallback } from 'react'
import { Plus, Download, Upload, X, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axiosConfig'
import DataTable from '../../components/common/DataTable'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Loading from '../../components/common/Loading'

const EMPTY_FORM = {
  fullName: '', email: '', password: '', rollNumber: '',
  departmentId: '', program: '', semester: '', phone: '',
  gender: '', dateOfBirth: ''
}

export default function Students() {
  const [students, setStudents] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editStudent, setEditStudent] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [s, d] = await Promise.all([api.get('/admin/students'), api.get('/admin/departments')])
      setStudents(s.data)
      setDepartments(d.data)
    } catch { toast.error('Failed to load data') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = students.filter(s =>
    s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => { setEditStudent(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true) }
  const openEdit = (s) => {
    setEditStudent(s)
    setForm({
      fullName: s.fullName || '', email: s.email || '', password: '',
      rollNumber: s.rollNumber || '', departmentId: s.departmentId || '',
      program: s.program || '', semester: s.semester || '',
      phone: s.phone || '', gender: s.gender || '',
      dateOfBirth: s.dateOfBirth || ''
    })
    setErrors({})
    setModalOpen(true)
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    if (!editStudent && !form.password) e.password = 'Required'
    if (!form.rollNumber.trim()) e.rollNumber = 'Required'
    if (!form.departmentId) e.departmentId = 'Required'
    return e
  }

  const handleSave = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      const payload = { ...form, semester: form.semester ? Number(form.semester) : null, departmentId: Number(form.departmentId) }
      if (editStudent) {
        await api.put(`/admin/students/${editStudent.id}`, payload)
        toast.success('Student updated')
      } else {
        await api.post('/admin/students', payload)
        toast.success('Student created')
      }
      setModalOpen(false)
      fetchData()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/students/${deleteId}`)
      toast.success('Student deactivated')
      setDeleteId(null)
      fetchData()
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed') }
  }

  const handleExport = async () => {
    try {
      const res = await api.get('/admin/export/students', { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a'); a.href = url; a.download = 'students.csv'; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Export failed') }
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const fd = new FormData(); fd.append('file', file)
    try {
      await api.post('/admin/import/students', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Import successful'); fetchData()
    } catch (err) { toast.error(err.response?.data?.message || 'Import failed') }
    e.target.value = ''
  }

  const columns = [
    { key: 'fullName', label: 'Name' },
    { key: 'rollNumber', label: 'Roll No.' },
    { key: 'email', label: 'Email' },
    { key: 'departmentName', label: 'Department' },
    { key: 'program', label: 'Program' },
    { key: 'semester', label: 'Sem' },
    { key: 'active', label: 'Status', render: (v) => v ? <span className="badge-green">Active</span> : <span className="badge-red">Inactive</span> },
    {
      key: 'actions', label: 'Actions', render: (_, row) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(row)} className="text-blue-600 hover:underline text-xs">Edit</button>
          <button onClick={() => setDeleteId(row.id)} className="text-red-500 hover:underline text-xs">Remove</button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleExport} className="btn-secondary text-xs flex items-center gap-1"><Download size={14} />Export CSV</button>
          <label className="btn-secondary text-xs flex items-center gap-1 cursor-pointer"><Upload size={14} />Import CSV<input type="file" accept=".csv" className="hidden" onChange={handleImport} /></label>
          <button onClick={openAdd} className="btn-primary text-xs flex items-center gap-1"><Plus size={14} />Add Student</button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, roll..." className="input-field pl-9 text-sm" />
          </div>
          <span className="text-sm text-gray-500">{filtered.length} records</span>
        </div>
        <DataTable columns={columns} data={filtered} loading={loading} />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editStudent ? 'Edit Student' : 'Add Student'}</h3>
              <button onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'fullName', label: 'Full Name', span: 2 },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'rollNumber', label: 'Roll Number' },
                ...(!editStudent ? [{ name: 'password', label: 'Password', type: 'password', span: 2 }] : []),
                { name: 'program', label: 'Program' },
                { name: 'semester', label: 'Semester', type: 'number' },
                { name: 'phone', label: 'Phone' },
                { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
              ].map(f => (
                <div key={f.name} className={f.span === 2 ? 'col-span-2' : ''}>
                  <label className="text-xs font-medium text-gray-700">{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    value={form[f.name]}
                    onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                    className={`input-field text-sm mt-0.5 ${errors[f.name] ? 'border-red-400' : ''}`}
                  />
                  {errors[f.name] && <p className="text-red-500 text-xs">{errors[f.name]}</p>}
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-700">Department</label>
                <select value={form.departmentId} onChange={e => setForm(p => ({ ...p, departmentId: e.target.value }))} className={`input-field text-sm mt-0.5 ${errors.departmentId ? 'border-red-400' : ''}`}>
                  <option value="">Select...</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                {errors.departmentId && <p className="text-red-500 text-xs">{errors.departmentId}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Gender</label>
                <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value }))} className="input-field text-sm mt-0.5">
                  <option value="">Select...</option>
                  {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setModalOpen(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Deactivate Student"
        message="Are you sure you want to deactivate this student?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
