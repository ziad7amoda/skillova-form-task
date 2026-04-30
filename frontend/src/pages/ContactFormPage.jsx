import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const inputClass =
  'w-full bg-bg/60 border border-border rounded-xl px-4 py-3 text-text text-sm placeholder:text-text-faint focus:outline-none'

export default function ContactFormPage() {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()
  const navigate = useNavigate()

  async function onSubmit(data) {
    try {
      await api.post('/submissions/contact/', data)
      toast.success('Contact request submitted!')
      navigate('/dashboard')
    } catch (err) {
      const apiErrors = err.response?.data ?? {}
      Object.keys(apiErrors).forEach((key) => {
        setError(key, {
          message: Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key],
        })
      })
    }
  }

  const priorityConfig = {
    low: { active: 'bg-teal/10 border-teal/30 text-teal', icon: '↓' },
    medium: { active: 'bg-amber-400/10 border-amber-400/30 text-amber-400', icon: '→' },
    high: { active: 'bg-danger/10 border-danger/30 text-danger', icon: '↑' },
  }

  return (
    <div className="grain-overlay min-h-screen bg-bg text-text">
      <Navbar />
      <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-teal/[0.03] to-transparent pointer-events-none" />

      <main className="relative max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-text-muted text-sm">Have a question or need support? We&apos;re here to help.</p>
        </div>

        <div className="bg-surface/60 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl shadow-black/10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Subject</label>
              <input
                {...register('subject', { required: 'Required' })}
                className={inputClass}
                placeholder="What is this about?"
              />
              {errors.subject && (
                <p className="text-danger text-xs mt-1.5 font-medium">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Message</label>
              <textarea
                {...register('body', { required: 'Required' })}
                rows={5}
                className={`${inputClass} resize-none`}
                placeholder="Tell us more about your request..."
              />
              {errors.body && (
                <p className="text-danger text-xs mt-1.5 font-medium">{errors.body.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-3 uppercase tracking-wider">Priority</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(priorityConfig).map(([value, { active, icon }]) => (
                  <label
                    key={value}
                    className={`flex flex-col items-center gap-1.5 px-4 py-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      watch('priority') === value
                        ? active
                        : 'bg-bg/60 border-border text-text-muted hover:border-border-hover'
                    }`}
                  >
                    <input
                      type="radio"
                      value={value}
                      {...register('priority', { required: 'Required' })}
                      className="sr-only"
                    />
                    <span className="text-lg">{icon}</span>
                    <span className="text-xs font-medium capitalize">{value}</span>
                  </label>
                ))}
              </div>
              {errors.priority && (
                <p className="text-danger text-xs mt-1.5 font-medium">{errors.priority.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal text-bg font-semibold py-3 rounded-xl text-sm hover:bg-teal-dim disabled:opacity-50 transition-all duration-200 hover:shadow-lg hover:shadow-teal/20 active:scale-[0.98] mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Request'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
