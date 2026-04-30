import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm()
  const navigate = useNavigate()

  async function onSubmit(data) {
    try {
      const res = await api.post('/auth/login/', data)
      localStorage.setItem('access', res.data.access)
      localStorage.setItem('refresh', res.data.refresh)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError('root', {
        message: err.response?.data?.detail ?? 'Login failed.',
      })
    }
  }

  return (
    <div className="grain-overlay min-h-screen bg-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/15 rounded-full blur-[120px] animate-[float_20s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-teal/10 rounded-full blur-[100px] animate-[float_25s_ease-in-out_infinite_reverse]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] animate-[pulse-glow_8s_ease-in-out_infinite]" />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="font-display text-2xl font-bold text-text tracking-tight">Skillova</span>
          </div>
          <p className="text-text-muted text-sm">Welcome back. Sign in to continue.</p>
        </div>

        {/* Card */}
        <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl shadow-black/20">
          <h1 className="font-display text-2xl font-bold text-text mb-6">Sign in</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Username</label>
              <input
                {...register('username', { required: 'Required' })}
                autoComplete="username"
                className="w-full bg-bg/60 border border-border rounded-xl px-4 py-3 text-text text-sm placeholder:text-text-faint focus:outline-none"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-danger text-xs mt-1.5 font-medium">{errors.username.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Required' })}
                autoComplete="current-password"
                className="w-full bg-bg/60 border border-border rounded-xl px-4 py-3 text-text text-sm placeholder:text-text-faint focus:outline-none"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-danger text-xs mt-1.5 font-medium">{errors.password.message}</p>
              )}
            </div>
            {errors.root && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg px-4 py-2.5">
                <p className="text-danger text-xs font-medium">{errors.root.message}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative bg-accent text-bg font-semibold py-3 rounded-xl text-sm hover:bg-accent-dim disabled:opacity-50 transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98] mt-1"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-text-faint text-sm mt-8 text-center">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-accent font-medium hover:text-accent-dim transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
