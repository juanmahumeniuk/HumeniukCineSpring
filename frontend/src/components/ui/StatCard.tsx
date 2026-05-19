import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  icon?: LucideIcon
  valueClassName?: string
}

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  valueClassName = '',
}: StatCardProps) {
  return (
    <div className="glass-card group relative p-5">
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted">
            {label}
          </p>
          <p
            className={`heading-display mt-2 truncate text-[28px] leading-none ${valueClassName}`}
          >
            {value}
          </p>
          {subtext && (
            <p className="mt-2 text-[12.5px] text-text-muted">{subtext}</p>
          )}
        </div>
        {Icon && (
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] ring-1 ring-white/10 backdrop-blur-xl transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-[-3deg]">
            <div className="absolute inset-0 rounded-2xl bg-accent/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <Icon className="relative h-5 w-5 text-accent" />
          </div>
        )}
      </div>
    </div>
  )
}
