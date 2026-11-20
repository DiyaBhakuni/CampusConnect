import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import api from '../../api/axiosConfig'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'

export default function Directory() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const doSearch = async (q) => {
    if (!q.trim()) return
    setLoading(true)
    try {
      const r = await api.get(`/search?query=${encodeURIComponent(q)}`)
      setResults(r.data)
    } catch { toast.error('Search failed') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) { setQuery(q); doSearch(q) }
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    doSearch(query)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">Campus Directory</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search students, faculty, courses..." className="input-field pl-10" />
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {loading ? <Loading /> : results && (
        <div className="space-y-6">
          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">Students ({results.students?.length || 0})</h2>
            {results.students?.length === 0 ? <p className="text-sm text-gray-500">No students found</p> : (
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-200 text-gray-600">
                    <th className="px-4 py-2 text-left font-medium">Name</th>
                    <th className="px-4 py-2 text-left font-medium">Roll No.</th>
                    <th className="px-4 py-2 text-left font-medium">Department</th>
                    <th className="px-4 py-2 text-left font-medium">Program</th>
                  </tr></thead>
                  <tbody>{results.students.map(s => (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2">{s.fullName}</td>
                      <td className="px-4 py-2">{s.rollNumber}</td>
                      <td className="px-4 py-2">{s.departmentName}</td>
                      <td className="px-4 py-2">{s.program || '—'}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">Faculty ({results.faculty?.length || 0})</h2>
            {results.faculty?.length === 0 ? <p className="text-sm text-gray-500">No faculty found</p> : (
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-200 text-gray-600">
                    <th className="px-4 py-2 text-left font-medium">Name</th>
                    <th className="px-4 py-2 text-left font-medium">Emp No.</th>
                    <th className="px-4 py-2 text-left font-medium">Department</th>
                    <th className="px-4 py-2 text-left font-medium">Designation</th>
                  </tr></thead>
                  <tbody>{results.faculty.map(f => (
                    <tr key={f.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2">{f.fullName}</td>
                      <td className="px-4 py-2">{f.employeeNumber}</td>
                      <td className="px-4 py-2">{f.departmentName}</td>
                      <td className="px-4 py-2">{f.designation || '—'}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-800 mb-3">Courses ({results.courses?.length || 0})</h2>
            {results.courses?.length === 0 ? <p className="text-sm text-gray-500">No courses found</p> : (
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-200 text-gray-600">
                    <th className="px-4 py-2 text-left font-medium">Code</th>
                    <th className="px-4 py-2 text-left font-medium">Course Name</th>
                    <th className="px-4 py-2 text-left font-medium">Department</th>
                    <th className="px-4 py-2 text-left font-medium">Credits</th>
                  </tr></thead>
                  <tbody>{results.courses.map(c => (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-primary-700">{c.courseCode}</td>
                      <td className="px-4 py-2">{c.courseName}</td>
                      <td className="px-4 py-2">{c.departmentName}</td>
                      <td className="px-4 py-2">{c.credits || '—'}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {!results && !loading && (
        <div className="card"><EmptyState title="Search the campus directory" description="Enter a name, roll number, employee ID or course code to search." /></div>
      )}
    </div>
  )
}
