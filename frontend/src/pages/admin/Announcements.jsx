import { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'
import toast from 'react-hot-toast'
import Loading from '../../components/common/Loading'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const AUDIENCE = ['ALL', 'STUDENTS', 'FACULTY']
const AUDIENCE_COLORS = { ALL: 'badge-blue', STUDENTS: 'badge-green', FACULTY: 'badge-yellow' }

function Modal({ item, onClose, onSaved }) {
  const isEdit = !!item?.id
  const [form, setForm] = useState({ title: '', content: '', audience: 'ALL', ...item })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.content) { toast.error('Title and content are required'); return }
    setLoading(true)
    try {
      if (isEdit) await api.put(`/admin/announcements/${item.id}`, form)
      else await api.post('/admin/announcements', form)
      toast.success(`Announcement ${isEdit ? 'updated' : 'created'}`)
      onSaved()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{isEdit ? 'Edit' : 'New'} Announcement</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input className="input-field" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea rows={4} className="input-field resize-none" value={form.content} onChange={e => setForm({...form, content: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
            <select className="input-field" value={form.audience} onChange={e => setForm({...form, audience: e.target.value})}>
              {AUDIENCE.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
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

export default function Announcements() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const load = () => {
    setLoading(true)
    api.get('/admin/announcements').then(r => setData(r.data)).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const deleteItem = async (id) => {
    try { await api.delete(`/admin/announcements/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500 text-sm mt-1">Manage campus announcements</p>
        </div>
        <button onClick={() => setModal({})} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />New Announcement
        </button>
      </div>

      {loading ? <Loading /> : (
        <div className="space-y-4">
          {data.length === 0 ? (
            <div className="card text-center text-gray-500 py-12">No announcements yet.</div>
          ) : data.map(a => (
            <div key={a.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{a.title}</h3>
                    <span className={AUDIENCE_COLORS[a.audience] || 'badge-blue'}>{a.audience}</span>
                  </div>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{a.content}</p>
                  <p className="text-gray-400 text-xs mt-2">By {a.postedBy} · {new Date(a.postedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setModal(a)} className="text-blue-600 hover:text-blue-800"><Pencil size={15} /></button>
                  <button onClick={() => setConfirm(a.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && <Modal item={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />}
      <ConfirmDialog open={confirm !== null} title="Delete" message="Delete this announcement?"
        onConfirm={() => { deleteItem(confirm); setConfirm(null) }}
        onCancel={() => setConfirm(null)} />
    </div>
  )
}
