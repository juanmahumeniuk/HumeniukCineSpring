import { Inbox } from 'lucide-react'

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-3 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.04] ring-1 ring-white/10">
        <Inbox className="h-6 w-6 text-text-muted" />
      </div>
      <p className="text-[15px] text-text-muted">{message}</p>
    </div>
  )
}
