export function ProgressBar({
  value,
  label,
}: {
  value: number
  label?: string
}) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex justify-between text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
          <span>{label}</span>
          <span className="tabular-nums text-white">{pct}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/[0.04]">
        <div
          className="liquid-progress h-full rounded-full bg-gradient-to-r from-[#5e9eff] via-[#0a84ff] to-[#0a6cd1] shadow-[0_0_18px_-2px_rgba(10,132,255,0.65)] transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
