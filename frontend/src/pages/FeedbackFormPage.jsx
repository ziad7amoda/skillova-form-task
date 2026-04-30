import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Navbar from '../components/Navbar'
import api from '../api/axios'

const inputClass =
  'w-full bg-bg/60 border border-border rounded-xl px-4 py-3 text-text text-sm placeholder:text-text-faint focus:outline-none'

const starLabels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent']

export default function FeedbackFormPage() {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { rating: '' } })
  const navigate = useNavigate()
  const currentRating = watch('rating')

  async function onSubmit(data) {
    try {
      await api.post('/submissions/feedback/', { ...data, rating: parseInt(data.rating, 10) })
      toast.success('Feedback submitted!')
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

  return (
    <div className="grain-overlay min-h-screen bg-bg text-text">
      <Navbar />
      <div className="absolute top-0 left-0 right-0 h-60 bg-gradient-to-b from-accent/[0.03] to-transparent pointer-events-none" />

      <main className="relative max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-3xl font-bold mb-2">Submit Feedback</h1>
          <p className="text-text-muted text-sm">Help us improve with your thoughts and suggestions.</p>
        </div>

        <div className="bg-surface/60 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl shadow-black/10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Title</label>
              <input
                {...register('title', { required: 'Required' })}
                className={inputClass}
                placeholder="Brief summary of your feedback"
              />
              {errors.title && <p className="text-danger text-xs mt-1.5 font-medium">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Message</label>
              <textarea
                {...register('message', { required: 'Required' })}
                rows={5}
                className={`${inputClass} resize-none`}
                placeholder="Describe your feedback in detail..."
              />
              {errors.message && <p className="text-danger text-xs mt-1.5 font-medium">{errors.message.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-3 uppercase tracking-wider">Rating</label>
              <input type="hidden" {...register('rating', { required: 'Please select a rating' })} />
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setValue('rating', String(n), { shouldValidate: true })}
                    className={`w-11 h-11 rounded-xl border text-sm font-mono font-bold transition-all duration-200 ${
                      String(n) === currentRating
                        ? 'bg-accent text-bg border-accent scale-110 shadow-lg shadow-accent/20'
                        : 'bg-bg/60 text-text-muted border-border hover:border-accent/40 hover:text-accent'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                {currentRating && (
                  <span className="text-xs text-text-muted ml-2 animate-fade-in">
                    {starLabels[parseInt(currentRating) - 1]}
                  </span>
                )}
              </div>
              {errors.rating && <p className="text-danger text-xs mt-1.5 font-medium">{errors.rating.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-2 uppercase tracking-wider">Category</label>
              <div className="grid grid-cols-3 gap-3">
                {['bug', 'feature', 'general'].map((cat) => {
                  const icons = {
                    bug: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.867.966 1.867 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.867-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c1.148 0 2.278-.08 3.383-.237C16.42 12.367 17.25 11.547 17.25 10.5c0-3.728-2.35-6.75-5.25-6.75S6.75 6.772 6.75 10.5c0 1.046.83 1.867 1.867 2.013A24.204 24.204 0 0 0 12 12.75Zm0 0V21M3 12h18" />
                      </svg>
                    ),
                    feature: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                      </svg>
                    ),
                    general: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                      </svg>
                    ),
                  }
                  return (
                    <label
                      key={cat}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        watch('category') === cat
                          ? 'bg-accent/10 border-accent/30 text-accent'
                          : 'bg-bg/60 border-border text-text-muted hover:border-border-hover'
                      }`}
                    >
                      <input
                        type="radio"
                        value={cat}
                        {...register('category', { required: 'Required' })}
                        className="sr-only"
                      />
                      {icons[cat]}
                      <span className="text-sm font-medium capitalize">{cat}</span>
                    </label>
                  )
                })}
              </div>
              {errors.category && <p className="text-danger text-xs mt-1.5 font-medium">{errors.category.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent text-bg font-semibold py-3 rounded-xl text-sm hover:bg-accent-dim disabled:opacity-50 transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98] mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
