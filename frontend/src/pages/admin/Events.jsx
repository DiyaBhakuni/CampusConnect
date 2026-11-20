import { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'
import toast from 'react-hot-toast'
import Loading from '../../components/common/Loading'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { Plus, Pencil, Trash2, X, Calendar, MapPin } from 'lucide-react'

function Modal({ item, onClose, onSaved }) {
  const isEdit = !!item?.id
  const [form, setForm] = useState({ title: '', description: '', eventDate: '', venue: '', organizer: '', ...item, eventDate: item?.eventDate || '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEdit) await api.put(`/admin/events/${item.id}`, form)
      else await api.post('/admin/events', form)
      toast.success(`Event ${isEdit ? 'updated' : 'created'}`)
      onSaved()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{isEdit ? 'Edit' : 'New'} Event</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input className="input-field" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} className="input-field resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
            <input type="date" className="input-field" value={form.eventDate} onChange={e => setForm({...form, eventDate: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
            <input className="input-field" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
            <input className="input-field" value={form.organizer} onChange={e => setForm({...form, organizer: e.target.value})} />
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

export default function Events() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const load = () => {
    setLoading(true)
    api.get('/admin/events').then(r => setData(r.data)).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const deleteItem = async (id) => {
    try { await api.delete(`/admin/events/${id}`); toast.success('Event deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campus Events</h1>
          <p className="text-gray-500 text-sm mt-1">Manage upcoming events</p>
        </div>
        <button onClick={() => setModal({})} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />New Event
        </button>
      </div>

      {loading ? <Loading /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.length === 0 ? (
            <div className="col-span-full card text-center text-gray-500 py-12">No events yet.</div>
          ) : data.map(event => (
            <div key={event.id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                <div className="flex gap-2">
                  <button onClick={() => setModal(event)} className="text-blue-600 hover:text-blue-800"><Pencil size={15} /></button>
                  <button onClick={() => setConfirm(event.id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
                </div>
              </div>
              {event.description && <p className="text-gray-500 text-sm mt-2 line-clamp-2">{event.description}</p>}
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} className="text-primary-500" />
                  {new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                {event.venue && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} className="text-primary-500" />
                    {event.venue}
                  </div>
                )}
              </div>
              {event.organizer && <p className="text-xs text-gray-400 mt-2">By {event.organizer}</p>}
            </div>
          ))}
        </div>
      )}

      {modal !== null && <Modal item={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />}
      <ConfirmDialog open={confirm !== null} title="Delete Event" message="Delete this event?"
        onConfirm={() => { deleteItem(confirm); setConfirm(null) }}
        onCancel={() => setConfirm(null)} />
    </div>
  )
}
