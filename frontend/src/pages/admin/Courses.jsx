import { useState, useEffect, useCallback } from 'react'
import { Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axiosConfig'
import DataTable from '../../components/common/DataTable'
import ConfirmDialog from '../../components/common/ConfirmDialog'

const EMPTY_FORM = { courseCode: '', courseName: '', description: '', credits: '', semester: '', departmentId: '' }
const ASSIGN_FORM = { facultyId: '', courseId: '' }

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [departments, setDepartments] = useState([])
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editCourse, setEditCourse] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [assignForm, setAssignForm] = useState(ASSIGN_FORM)
  const [assigning, setAssigning] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [c, d, f] = await Promise.all([api.get('/admin/courses'), api.get('/admin/departments'), api.get('/admin/faculty')])
      setCourses(c.data); setDepartments(d.data); setFaculty(f.data)
    } catch { toast.error('Failed to load data') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openAdd = () => { setEditCourse(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true) }
  const openEdit = (c) => {
    setEditCourse(c)
    setForm({ courseCode: c.courseCode || '', courseName: c.courseName || '', description: c.description || '', credits: c.credits || '', semester: c.semester || '', departmentId: c.departmentId || '' })
    setErrors({}); setModalOpen(true)
  }

  const validate = () => {
    const e = {}
    if (!form.courseCode.trim()) e.courseCode = 'Required'
    if (!form.courseName.trim()) e.courseName = 'Required'
    if (!form.departmentId) e.departmentId = 'Required'
    return e
  }

  const handleSave = async () => {
    const e = validate(); if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      const payload = { ...form, credits: form.credits ? Number(form.credits) : null, semester: form.semester ? Number(form.semester) : null, departmentId: Number(form.departmentId) }
      if (editCourse) { await api.put(`/admin/courses/${editCourse.id}`, payload); toast.success('Course updated') }
      else { await api.post('/admin/courses', payload); toast.success('Course created') }
      setModalOpen(false); fetchData()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await api.delete(`/admin/courses/${deleteId}`); toast.success('Course deactivated'); setDeleteId(null); fetchData() }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleAssign = async () => {
    if (!assignForm.facultyId || !assignForm.courseId) { toast.error('Select both faculty and course'); return }
    setAssigning(true)
    try {
      await api.post('/admin/course-assignments', { facultyId: Number(assignForm.facultyId), courseId: Number(assignForm.courseId) })
      toast.success('Faculty assigned to course'); setAssignForm(ASSIGN_FORM)
    } catch (err) { toast.error(err.response?.data?.message || 'Assignment failed') }
    finally { setAssigning(false) }
  }

  const columns = [
    { key: 'courseCode', label: 'Code' },
    { key: 'courseName', label: 'Course Name' },
    { key: 'departmentName', label: 'Department' },
    { key: 'credits', label: 'Credits' },
    { key: 'semester', label: 'Sem' },
    { key: 'enrollmentCount', label: 'Enrolled' },
    { key: 'active', label: 'Status', render: (v) => v ? <span className="badge-green">Active</span> : <span className="badge-red">Inactive</span> },
    { key: 'actions', label: 'Actions', render: (_, row) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(row)} className="text-blue-600 hover:underline text-xs">Edit</button>
        <button onClick={() => setDeleteId(row.id)} className="text-red-500 hover:underline text-xs">Deactivate</button>
      </div>
    )}
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <button onClick={openAdd} className="btn-primary text-xs flex items-center gap-1"><Plus size={14} />Add Course</button>
      </div>

      {/* Assign faculty */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Assign Faculty to Course</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-gray-600">Faculty</label>
            <select value={assignForm.facultyId} onChange={e => setAssignForm(p => ({ ...p, facultyId: e.target.value }))} className="input-field text-sm mt-0.5 min-w-[180px]">
              <option value="">Select faculty...</option>
              {faculty.map(f => <option key={f.id} value={f.id}>{f.fullName} ({f.employeeNumber})</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600">Course</label>
            <select value={assignForm.courseId} onChange={e => setAssignForm(p => ({ ...p, courseId: e.target.value }))} className="input-field text-sm mt-0.5 min-w-[180px]">
              <option value="">Select course...</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.courseCode} - {c.courseName}</option>)}
            </select>
          </div>
          <button onClick={handleAssign} disabled={assigning} className="btn-primary text-sm">{assigning ? 'Assigning...' : 'Assign'}</button>
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={courses} loading={loading} />
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{editCourse ? 'Edit Course' : 'Add Course'}</h3>
              <button onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[{ name: 'courseCode', label: 'Course Code' }, { name: 'courseName', label: 'Course Name', span: 2 }, { name: 'credits', label: 'Credits', type: 'number' }, { name: 'semester', label: 'Semester', type: 'number' }, { name: 'description', label: 'Description', span: 2 }].map(f => (
                <div key={f.name} className={f.span === 2 ? 'col-span-2' : ''}>
                  <label className="text-xs font-medium text-gray-700">{f.label}</label>
                  <input type={f.type || 'text'} value={form[f.name]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} className={`input-field text-sm mt-0.5 ${errors[f.name] ? 'border-red-400' : ''}`} />
                  {errors[f.name] && <p className="text-red-500 text-xs">{errors[f.name]}</p>}
                </div>
              ))}
              <div className="col-span-2">
                <label className="text-xs font-medium text-gray-700">Department</label>
                <select value={form.departmentId} onChange={e => setForm(p => ({ ...p, departmentId: e.target.value }))} className={`input-field text-sm mt-0.5 ${errors.departmentId ? 'border-red-400' : ''}`}>
                  <option value="">Select...</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                {errors.departmentId && <p className="text-red-500 text-xs">{errors.departmentId}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setModalOpen(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog open={!!deleteId} title="Deactivate Course" message="Deactivate this course?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
