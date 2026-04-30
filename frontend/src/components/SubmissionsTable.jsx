import StatusBadge from './StatusBadge'

export default function SubmissionsTable({ submissions }) {
  if (!submissions?.length) {
    return (
      <div className="text-center py-16 animate-fade-up">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-faint">
            <path d="M9 12h6M12 9v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-text-muted text-sm font-medium">No submissions yet</p>
        <p className="text-text-faint text-xs mt-1">Your feedback and contact requests will appear here</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface/50 backdrop-blur-sm animate-fade-up" style={{ animationDelay: '0.1s' }}>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="px-5 py-3.5 text-xs font-mono font-semibold uppercase tracking-wider text-text-faint">Type</th>
            <th className="px-5 py-3.5 text-xs font-mono font-semibold uppercase tracking-wider text-text-faint">Title / Subject</th>
            <th className="px-5 py-3.5 text-xs font-mono font-semibold uppercase tracking-wider text-text-faint">Status</th>
            <th className="px-5 py-3.5 text-xs font-mono font-semibold uppercase tracking-wider text-text-faint">Date</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub, i) => (
            <tr
              key={`${sub.type}-${sub.id}`}
              className="border-b border-border/40 last:border-0 hover:bg-accent/[0.03] transition-colors duration-200 animate-fade-up"
              style={{ animationDelay: `${0.05 * (i + 1)}s` }}
            >
              <td className="px-5 py-4">
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-mono font-medium border ${
                  sub.type === 'feedback'
                    ? 'bg-accent/10 text-accent border-accent/20'
                    : 'bg-teal/10 text-teal border-teal/20'
                }`}>
                  {sub.type}
                </span>
              </td>
              <td className="px-5 py-4 text-text font-medium">
                {sub.title ?? sub.subject}
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={sub.status} />
              </td>
              <td className="px-5 py-4 text-text-faint font-mono text-xs whitespace-nowrap">
                {new Date(sub.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
