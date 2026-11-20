import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import api from '../../api/axiosConfig'
import toast from 'react-hot-toast'

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
  const [show, setShow] = useState({ current: false, new_: false, confirm: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.currentPassword) e.currentPassword = 'Current password is required'
    if (!form.newPassword) e.newPassword = 'New password is required'
    else if (form.newPassword.length < 6) e.newPassword = 'Minimum 6 characters'
    if (!form.confirmNewPassword) e.confirmNewPassword = 'Please confirm your new password'
    else if (form.newPassword !== form.confirmNewPassword) e.confirmNewPassword = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    setErrors(e2)
    if (Object.keys(e2).length > 0) return
    setLoading(true)
    try {
      await api.post('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      toast.success('Password changed successfully')
      setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to change password'
      toast.error(msg)
    } finally { setLoading(false) }
  }

  const field = (key, label, showKey) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type={show[showKey] ? 'text' : 'password'}
          value={form[key]}
          onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: undefined })) }}
          className={`input-field pl-9 pr-10 ${errors[key] ? 'border-red-400 focus:ring-red-400' : ''}`}
        />
        <button type="button" onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h1>
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          {field('currentPassword', 'Current Password', 'current')}
          {field('newPassword', 'New Password', 'new_')}
          {field('confirmNewPassword', 'Confirm New Password', 'confirm')}
          <div className="pt-2">
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
