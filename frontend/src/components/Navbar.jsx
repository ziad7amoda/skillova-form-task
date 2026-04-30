import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/submit/feedback', label: 'Feedback' },
  { to: '/submit/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  function logout() {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <nav className="relative z-10 border-b border-border/60 backdrop-blur-md bg-surface/70">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="font-display text-xl font-bold tracking-tight text-text group flex items-center gap-2"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-accent group-hover:scale-125 transition-transform duration-300" />
          Skillova
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                location.pathname === to
                  ? 'text-accent bg-accent/10'
                  : 'text-text-muted hover:text-text hover:bg-white/5'
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="w-px h-5 bg-border mx-2" />
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-text-faint hover:text-danger rounded-lg hover:bg-danger/5 transition-all duration-200"
          >
            Logout
          </button>
        </div>

        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:bg-white/5 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" className="transition-transform duration-200">
            <path
              d={open ? 'M1 1L17 13M1 13L17 1' : 'M0 1H18M0 7H12M0 13H18'}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-surface/90 backdrop-blur-md animate-fade-in">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === to
                    ? 'text-accent bg-accent/10'
                    : 'text-text-muted hover:text-text hover:bg-white/5'
                }`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="h-px bg-border/60 my-1" />
            <button
              onClick={logout}
              className="px-4 py-3 text-left text-sm text-text-faint hover:text-danger rounded-lg hover:bg-danger/5 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
