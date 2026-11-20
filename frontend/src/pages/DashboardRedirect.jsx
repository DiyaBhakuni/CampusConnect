import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function DashboardRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />
  if (user.role === 'ROLE_FACULTY') return <Navigate to="/faculty" replace />
  if (user.role === 'ROLE_STUDENT') return <Navigate to="/student" replace />
  return <Navigate to="/login" replace />
}
