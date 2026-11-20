import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardRedirect from './pages/DashboardRedirect'

// Admin
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import Students from './pages/admin/Students'
import Faculty from './pages/admin/Faculty'
import Departments from './pages/admin/Departments'
import Courses from './pages/admin/Courses'
import Enrollments from './pages/admin/Enrollments'
import AdminTimetable from './pages/admin/Timetable'
import Announcements from './pages/admin/Announcements'
import Events from './pages/admin/Events'
import Reports from './pages/admin/Reports'

// Faculty
import FacultyLayout from './layouts/FacultyLayout'
import FacultyDashboard from './pages/faculty/FacultyDashboard'
import MyCourses from './pages/faculty/MyCourses'
import FacultyStudents from './pages/faculty/Students'
import Attendance from './pages/faculty/Attendance'
import Marks from './pages/faculty/Marks'
import FacultyTimetable from './pages/faculty/Timetable'

// Student
import StudentLayout from './layouts/StudentLayout'
import StudentDashboard from './pages/student/StudentDashboard'
import Profile from './pages/student/Profile'
import StudentCourses from './pages/student/Courses'
import StudentAttendance from './pages/student/Attendance'
import StudentMarks from './pages/student/Marks'
import StudentTimetable from './pages/student/Timetable'
import StudentAnnouncements from './pages/student/Announcements'
import StudentEvents from './pages/student/Events'

// Shared
import Notifications from './pages/shared/Notifications'
import Directory from './pages/shared/Directory'
import ChangePassword from './pages/shared/ChangePassword'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardRedirect />} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute role="ROLE_ADMIN"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="faculty" element={<Faculty />} />
            <Route path="departments" element={<Departments />} />
            <Route path="courses" element={<Courses />} />
            <Route path="enrollments" element={<Enrollments />} />
            <Route path="timetable" element={<AdminTimetable />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="events" element={<Events />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="directory" element={<Directory />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          {/* Faculty routes */}
          <Route path="/faculty" element={<ProtectedRoute role="ROLE_FACULTY"><FacultyLayout /></ProtectedRoute>}>
            <Route index element={<FacultyDashboard />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="students" element={<FacultyStudents />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="marks" element={<Marks />} />
            <Route path="timetable" element={<FacultyTimetable />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="directory" element={<Directory />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          {/* Student routes */}
          <Route path="/student" element={<ProtectedRoute role="ROLE_STUDENT"><StudentLayout /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="marks" element={<StudentMarks />} />
            <Route path="timetable" element={<StudentTimetable />} />
            <Route path="announcements" element={<StudentAnnouncements />} />
            <Route path="events" element={<StudentEvents />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="directory" element={<Directory />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
