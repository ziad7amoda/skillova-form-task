import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SubmissionsTable from '../components/SubmissionsTable'
import api from '../api/axios'

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') ?? '{}')

  useEffect(() => {
    api
      .get('/submissions/my/')
      .then((res) => setSubmissions(res.data.results))
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Total', value: submissions.length, color: 'text-text' },
    { label: 'Pending', value: submissions.filter(s => s.status === 'pending').length, color: 'text-amber-400' },
    { label: 'Reviewed', value: submissions.filter(s => s.status === 'reviewed').length, color: 'text-teal' },
  ]

  return (
    <div className="grain-overlay min-h-screen bg-bg text-text">
      <Navbar />

      {/* Subtle background gradient */}
      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-accent/[0.03] to-transparent pointer-events-none" />

      <main className="relative max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Welcome back,{' '}
            <span className="text-accent italic">{user.username ?? 'user'}</span>
          </h1>
          <p className="text-text-muted text-base">Manage your submissions and track their progress.</p>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <Link
            to="/submit/feedback"
            className="group relative bg-surface/60 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-accent/30 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                  <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="font-display text-lg font-semibold mb-1 text-text group-hover:text-accent transition-colors duration-200">
                Submit Feedback
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                Share bug reports, feature requests, or general feedback.
              </p>
            </div>
          </Link>

          <Link
            to="/submit/contact"
            className="group relative bg-surface/60 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-teal/30 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal">
                  <path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="font-display text-lg font-semibold mb-1 text-text group-hover:text-teal transition-colors duration-200">
                Contact Us
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                Reach out with questions or support requests.
              </p>
            </div>
          </Link>
        </div>

        {/* Stats bar */}
        {!loading && submissions.length > 0 && (
          <div className="flex items-center gap-6 mb-6 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            {stats.map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`font-mono text-xl font-bold ${color}`}>{value}</span>
                <span className="text-text-faint text-xs uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Submissions */}
        <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display text-xl font-semibold">Your Submissions</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          </div>
          {loading ? (
            <div className="flex items-center gap-3 py-12 justify-center">
              <svg className="w-5 h-5 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-text-muted text-sm">Loading submissions...</span>
            </div>
          ) : (
            <SubmissionsTable submissions={submissions} />
          )}
        </div>
      </main>
    </div>
  )
}
