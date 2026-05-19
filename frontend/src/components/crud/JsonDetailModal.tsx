import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/Button'

interface JsonDetailModalProps {
  open: boolean
  title: string
  data: unknown
  error?: string | null
  loading?: boolean
  onClose: () => void
}

export function JsonDetailModal({
  open,
  title,
  data,
  error,
  loading,
  onClose,
}: JsonDetailModalProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-md fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div className="glass-strong scale-in relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-info/15 blur-3xl" />
        <div className="relative mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="glass-badge text-info">JSON</span>
            <h2 className="heading-display text-lg">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="liquid-btn glass-subtle flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {loading ? (
          <div className="space-y-2 py-6">
            <div className="shimmer h-4 w-3/4 rounded-lg" />
            <div className="shimmer h-4 w-5/6 rounded-lg" />
            <div className="shimmer h-4 w-2/3 rounded-lg" />
          </div>
        ) : error ? (
          <p className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
            {error}
          </p>
        ) : (
          <pre className="glass-subtle overflow-auto rounded-2xl p-4 font-mono text-[12px] leading-relaxed text-emerald-300/90">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
