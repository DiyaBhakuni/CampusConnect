import { useState, useEffect, useCallback } from 'react'
import { Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axiosConfig'
import DataTable from '../../components/common/DataTable'
import ConfirmDialog from '../../components/common/ConfirmDialog'

const EMPTY_FORM = { name: '', code: '', hodName: '', description: '' }

export default function Departments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editDept, setEditDept] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try { const r = await api.get('/admin/departments'); setDepartments(r.data) }
    catch { toast.error('Failed to load departments') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditDept(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true) }
  const openEdit = (d) => { setEditDept(d); setForm({ name: d.name || '', code: d.code || '', hodName: d.hodName || '', description: d.description || '' }); setErrors({}); setModalOpen(true) }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.code.trim()) e.code = 'Required'
    return e
  }

  const handleSave = async () => {
    const e = validate(); if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      if (editDept) { await api.put(`/admin/departments/${editDept.id}`, form); toast.success('Department updated') }
      else { await api.post('/admin/departments', form); toast.success('Department created') }
      setModalOpen(false); fetchData()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await api.delete(`/admin/departments/${deleteId}`); toast.success('Department deleted'); setDeleteId(null); fetchData() }
    catch (err) { toast.error(err.response?.data?.message || 'Delete failed') }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'hodName', label: 'HOD' },
    { key: 'studentCount', label: 'Students' },
    { key: 'facultyCount', label: 'Faculty' },
    { key: 'courseCount', label: 'Courses' },
    { key: 'description', label: 'Description', render: (v) => <span className="text-gray-500 text-xs truncate max-w-xs block">{v || '—'}</span> },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(row)} className="text-blue-600 hover:underline text-xs">Edit</button>
        <button onClick={() => setDeleteId(row.id)} className="text-red-500 hover:underline text-xs">Delete</button>
      </div>
    )}
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
        <button onClick={openAdd} className="btn-primary text-xs flex items-center gap-1"><Plus size={14} />Add Department</button>
      </div>
      <div className="card">
        <DataTable columns={columns} data={departments} loading={loading} />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editDept ? 'Edit Department' : 'Add Department'}</h3>
              <button onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[{ name: 'name', label: 'Department Name' }, { name: 'code', label: 'Department Code' }, { name: 'hodName', label: 'HOD Name' }, { name: 'description', label: 'Description' }].map(f => (
                <div key={f.name}>
                  <label className="text-xs font-medium text-gray-700">{f.label}</label>
                  <input value={form[f.name]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} className={`input-field text-sm mt-0.5 ${errors[f.name] ? 'border-red-400' : ''}`} />
                  {errors[f.name] && <p className="text-red-500 text-xs">{errors[f.name]}</p>}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setModalOpen(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog open={!!deleteId} title="Delete Department" message="Delete this department? This may affect associated data." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
