import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, X } from 'lucide-react'
import { Button } from './Button'

interface EntityModalProps {
  open: boolean
  title: string
  onClose: () => void
  onSubmit: () => void
  children: ReactNode
  submitLabel?: string
  isSubmitting?: boolean
  /** Si se provee, se muestra un banner de error general arriba del formulario. */
  formError?: string | null
  /** Si es true, se muestra un banner indicando que hay errores en los campos. */
  hasFieldErrors?: boolean
}

export function EntityModal({
  open,
  title,
  onClose,
  onSubmit,
  children,
  submitLabel = 'Guardar',
  isSubmitting,
  formError,
  hasFieldErrors,
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

  const showBanner = !!formError || !!hasFieldErrors
  const bannerMessage =
    formError ??
    'Revisá los campos marcados en rojo antes de continuar.'

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
          noValidate
          className="relative"
        >
          {showBanner && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-xl border border-danger/40 bg-danger/10 px-3 py-2 text-[12.5px] leading-snug text-danger"
            >
              <AlertCircle className="mt-[1px] h-4 w-4 flex-shrink-0" aria-hidden />
              <span>{bannerMessage}</span>
            </div>
          )}
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

interface FormFieldProps {
  label: string
  children: ReactNode
  /** Mensaje de error a mostrar debajo del campo. */
  error?: string | null
  /** Texto de ayuda neutral (se oculta si hay error). */
  hint?: string
  /** Marca visualmente como obligatorio con un asterisco. */
  required?: boolean
  /** id explícito para asociar label/help/error con el input. */
  htmlFor?: string
}

export function FormField({
  label,
  children,
  error,
  hint,
  required,
  htmlFor,
}: FormFieldProps) {
  const autoId = useId()
  const fieldId = htmlFor ?? autoId
  const errorId = error ? `${fieldId}-error` : undefined
  const hintId = hint && !error ? `${fieldId}-hint` : undefined
  const describedBy = errorId ?? hintId

  const enhancedChild = enhanceChild(children, {
    id: fieldId,
    ariaInvalid: !!error,
    ariaDescribedBy: describedBy,
  })

  return (
    <div className="block">
      <label
        htmlFor={fieldId}
        className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted"
      >
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>
      {enhancedChild}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1 flex items-start gap-1 text-[11.5px] leading-snug text-danger"
        >
          <AlertCircle className="mt-[1px] h-3 w-3 flex-shrink-0" aria-hidden />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p
          id={hintId}
          className="mt-1 text-[11.5px] leading-snug text-text-muted"
        >
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function enhanceChild(
  child: ReactNode,
  attrs: { id: string; ariaInvalid: boolean; ariaDescribedBy?: string },
): ReactNode {
  if (!isValidElement(child)) return child
  const element = child as ReactElement<HTMLAttributes<HTMLElement>>
  const existingProps = element.props
  const existingDescribedBy = existingProps['aria-describedby']
  const describedBy =
    [existingDescribedBy, attrs.ariaDescribedBy].filter(Boolean).join(' ') ||
    undefined
  return cloneElement(element, {
    id: existingProps.id ?? attrs.id,
    'aria-invalid': attrs.ariaInvalid || undefined,
    'aria-describedby': describedBy,
  })
}

export const inputClass = 'glass-input'
