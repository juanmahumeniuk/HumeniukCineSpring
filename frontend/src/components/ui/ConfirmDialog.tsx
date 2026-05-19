import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function ConfirmDialog({
  open,
  message,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-md fade-in"
        onClick={onCancel}
        aria-hidden
      />
      <div className="glass-strong scale-in relative z-10 w-full max-w-sm overflow-hidden rounded-3xl p-7">
        <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-danger/20 blur-3xl" />
        <div className="relative flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 ring-1 ring-danger/30">
            <AlertTriangle className="h-6 w-6 text-danger" />
          </div>
          <p className="text-[15px] text-white">{message}</p>
          <div className="mt-6 flex w-full justify-center gap-2">
            <Button variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
              {isLoading ? 'Eliminando…' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
