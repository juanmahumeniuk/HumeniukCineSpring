import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from './Button'

interface EntityModalProps {
  open: boolean
  title: string
  onClose: () => void
  onSubmit: () => void
  children: ReactNode
  submitLabel?: string
  isSubmitting?: boolean
}

export function EntityModal({
  open,
  title,
  onClose,
  onSubmit,
  children,
  submitLabel = 'Guardar',
  isSubmitting,
}: EntityModalProps) {
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

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-md fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="glass-strong scale-in relative z-10 w-full max-w-md overflow-hidden rounded-3xl p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="entity-modal-title"
      >
        <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-info/15 blur-3xl" />

        <div className="relative mb-5 flex items-center justify-between">
          <h2 id="entity-modal-title" className="heading-display text-xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="liquid-btn glass-subtle flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
          className="relative"
        >
          <div className="space-y-4">{children}</div>
          <div className="mt-7 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando…' : submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}

export function FormField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
        {label}
      </span>
      {children}
    </label>
  )
}

export const inputClass = 'glass-input'
