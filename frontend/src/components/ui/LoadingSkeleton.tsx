export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="shimmer h-20 rounded-2xl border border-white/5"
        />
      ))}
    </div>
  )
}
