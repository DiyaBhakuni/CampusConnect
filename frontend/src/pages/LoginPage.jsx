import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, LogIn, Users, BookOpen, Shield, Info } from 'lucide-react'
import toast from 'react-hot-toast'

const CitySkyline = () => (
  <svg viewBox="0 0 400 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full opacity-10">
    <rect x="10" y="50" width="18" height="30" fill="#3b5bdb"/>
    <rect x="14" y="40" width="10" height="10" fill="#3b5bdb"/>
    <rect x="16" y="32" width="6" height="8" fill="#3b5bdb"/>
    <rect x="17" y="26" width="4" height="6" fill="#3b5bdb"/>
    <rect x="35" y="38" width="22" height="42" fill="#3b5bdb"/>
    <rect x="39" y="30" width="14" height="8" fill="#3b5bdb"/>
    <rect x="42" y="22" width="8" height="8" fill="#3b5bdb"/>
    <rect x="45" y="15" width="2" height="7" fill="#3b5bdb"/>
    <rect x="62" y="55" width="14" height="25" fill="#3b5bdb"/>
    <rect x="80" y="44" width="20" height="36" fill="#3b5bdb"/>
    <rect x="84" y="36" width="12" height="8" fill="#3b5bdb"/>
    <rect x="104" y="58" width="12" height="22" fill="#3b5bdb"/>
    <rect x="120" y="42" width="24" height="38" fill="#3b5bdb"/>
    <rect x="124" y="34" width="16" height="8" fill="#3b5bdb"/>
    <rect x="128" y="26" width="8" height="8" fill="#3b5bdb"/>
    <rect x="130" y="18" width="4" height="8" fill="#3b5bdb"/>
    <rect x="148" y="52" width="16" height="28" fill="#3b5bdb"/>
    <rect x="168" y="46" width="20" height="34" fill="#3b5bdb"/>
    <rect x="192" y="56" width="14" height="24" fill="#3b5bdb"/>
    <rect x="210" y="40" width="22" height="40" fill="#3b5bdb"/>
    <rect x="214" y="32" width="14" height="8" fill="#3b5bdb"/>
    <rect x="217" y="24" width="8" height="8" fill="#3b5bdb"/>
    <rect x="236" y="50" width="16" height="30" fill="#3b5bdb"/>
    <rect x="256" y="44" width="18" height="36" fill="#3b5bdb"/>
    <rect x="260" y="36" width="10" height="8" fill="#3b5bdb"/>
    <rect x="278" y="54" width="14" height="26" fill="#3b5bdb"/>
    <rect x="296" y="38" width="24" height="42" fill="#3b5bdb"/>
    <rect x="300" y="30" width="16" height="8" fill="#3b5bdb"/>
    <rect x="304" y="22" width="8" height="8" fill="#3b5bdb"/>
    <rect x="306" y="14" width="4" height="8" fill="#3b5bdb"/>
    <rect x="324" y="52" width="16" height="28" fill="#3b5bdb"/>
    <rect x="344" y="46" width="20" height="34" fill="#3b5bdb"/>
    <rect x="368" y="58" width="14" height="22" fill="#3b5bdb"/>
    <rect x="386" y="50" width="14" height="30" fill="#3b5bdb"/>
  </svg>
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const user = await login(email, password)
      toast.success(`Welcome, ${user.fullName}!`)
      if (user.role === 'ROLE_ADMIN') navigate('/admin')
      else if (user.role === 'ROLE_FACULTY') navigate('/faculty')
      else navigate('/student')
    } catch (err) {
      toast.error(err.response?.data?.message ?? 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center overflow-hidden">
      {/* Full-page campus background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/campus.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      />

      {/* Light overlay only on left for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

      {/* Top-left logo */}
      <div className="absolute top-5 left-7 flex items-center gap-3 z-20">
        <img src="/logo.png" alt="Quantara University" className="h-10 w-auto bg-white/90 rounded-lg p-1" />
        <div>
          <p className="text-white font-bold text-sm leading-tight drop-shadow">Quantara University</p>
          <p className="text-white/70 text-xs">Deemed to be University</p>
        </div>
      </div>

      {/* Script tagline — center top */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 hidden lg:block">
        <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }} className="text-white/80 text-xl tracking-widest">
          Learn &nbsp;·&nbsp; Grow &nbsp;·&nbsp; Achieve
        </p>
      </div>

      {/* Left content */}
      <div className="relative z-10 flex-1 px-10 lg:px-16 py-24 hidden lg:flex flex-col justify-center max-w-2xl">
        <h1 className="text-6xl font-black text-white leading-[1.05] mb-5 drop-shadow-lg">
          KT Online<br />
          <span className="text-blue-300">Campus</span>
        </h1>
        <p className="text-blue-100/90 text-lg max-w-sm leading-relaxed mb-10">
          A centralized platform for managing students, faculty, courses and campus activities.
        </p>

        {/* Role pills */}
        <div className="flex gap-3">
          {[
            { label: 'Students', Icon: Users },
            { label: 'Faculty', Icon: BookOpen },
            { label: 'Admin', Icon: Shield },
          ].map(({ label, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-medium"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <Icon size={14} />
              {label}
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-10 left-10 lg:left-16 flex items-start gap-3">
          <div className="w-1 h-10 rounded-full bg-blue-400 mt-0.5" />
          <div>
            <p className="text-white font-bold text-lg leading-tight">Your Campus.</p>
            <p className="text-blue-200 text-base">Our Digital Space.</p>
          </div>
        </div>
      </div>

      {/* Floating login card */}
      <div className="relative z-10 w-full lg:w-auto lg:min-w-[420px] lg:max-w-[460px] lg:mr-16 lg:ml-auto mx-4 my-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-10 pt-10 pb-6">
            {/* Card icon */}
            <div className="flex justify-center mb-5">
              <img src="/logo.png" alt="Quantara University" className="h-16 w-auto" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Welcome back</h2>
            <p className="text-gray-400 text-sm text-center mb-7">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                  </span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="you@campus.edu"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <button type="button" className="text-xs text-blue-600 hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors text-sm mt-2"
              >
                <LogIn size={15} />
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Demo credentials */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-sm font-semibold text-gray-700">Demo credentials</p>
                <Info size={14} className="text-gray-400" />
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <p>Admin: admin@campus.edu / admin123</p>
                <p>Faculty: faculty1@campus.edu / faculty123</p>
                <p>Student: student1@campus.edu / student123</p>
              </div>
            </div>
          </div>

          {/* City skyline at bottom of card */}
          <div className="px-2 pb-2 -mt-2">
            <CitySkyline />
          </div>
        </div>
      </div>
    </div>
  )
}
