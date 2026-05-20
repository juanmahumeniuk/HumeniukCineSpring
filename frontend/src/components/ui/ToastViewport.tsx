import { createPortal } from 'react-dom'
import { CheckCircle2, X, XCircle } from 'lucide-react'

export interface ToastItem {
  id: string
  type: 'success' | 'error'
  message: string
}

interface ToastViewportProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) return null

  return createPortal(
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[110] flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4"
      role="region"
      aria-label="Notificaciones"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success'
        return (
          <div
            key={toast.id}
            className={`glass-strong scale-in pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)] ${
              isSuccess
                ? 'border-emerald-400/30 bg-emerald-500/10'
                : 'border-danger/35 bg-danger/10'
            }`}
            role="status"
          >
            {isSuccess ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
            )}
            <p className="min-w-0 flex-1 text-[14px] leading-snug text-white">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="liquid-btn flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/60 hover:text-white"
              aria-label="Cerrar notificación"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>,
    document.body,
  )
}
