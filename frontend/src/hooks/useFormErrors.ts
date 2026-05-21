import { useCallback, useState } from 'react'
import {
  runValidators,
  type ValidationErrors,
  type ValidatorMap,
} from '../lib/validation'

/**
 * Maneja errores de validación por campo en formularios.
 *
 * Uso típico:
 *   const { errors, validate, clearError, reset } = useFormErrors()
 *   const ok = validate({ nombre, email }, { nombre: required(), email: compose(required(), email()) })
 *   if (!ok) return  // no llames a la mutación
 */
export function useFormErrors() {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validate = useCallback(
    <T extends Record<string, unknown>>(
      values: T,
      validators: ValidatorMap<T>,
    ): boolean => {
      const result = runValidators(values, validators)
      setErrors(result)
      return Object.keys(result).length === 0
    },
    [],
  )

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const reset = useCallback(() => setErrors({}), [])

  const hasErrors = Object.keys(errors).length > 0

  return { errors, hasErrors, validate, clearError, reset, setErrors }
}
