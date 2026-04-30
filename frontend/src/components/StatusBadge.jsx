const styles = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/25 shadow-amber-500/5',
  reviewed: 'bg-teal/10 text-teal border-teal/25 shadow-teal/5',
  closed: 'bg-white/5 text-text-faint border-border shadow-none',
}

export default function StatusBadge({ status }) {
  const s = styles[status] ?? styles.pending
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border shadow-sm ${s}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'pending' ? 'bg-amber-400 animate-pulse' :
        status === 'reviewed' ? 'bg-teal' : 'bg-text-faint'
      }`} />
      {status}
    </span>
  )
}
