export type ValidationErrors = Record<string, string>

export type Validator<T> = (value: T) => string | null

export type ValidatorMap<T extends Record<string, unknown>> = {
  [K in keyof T]?: Validator<T[K]>
}

function isEmpty(value: unknown): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

export function required<T>(label = 'Este campo'): Validator<T> {
  return (value) => (isEmpty(value) ? `${label} es obligatorio.` : null)
}

export function minLength(min: number, label = 'Este campo'): Validator<string> {
  return (value) => {
    if (isEmpty(value)) return null
    return value.trim().length < min
      ? `${label} debe tener al menos ${min} caracteres.`
      : null
  }
}

export function maxLength(max: number, label = 'Este campo'): Validator<string> {
  return (value) => {
    if (isEmpty(value)) return null
    return value.length > max
      ? `${label} no puede superar los ${max} caracteres.`
      : null
  }
}

export function email(label = 'El email'): Validator<string> {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return (value) => {
    if (isEmpty(value)) return null
    return re.test(value.trim())
      ? null
      : `${label} no tiene un formato válido (ejemplo: nombre@dominio.com).`
  }
}

export function number(label = 'Este campo'): Validator<string | number | null | undefined> {
  return (value) => {
    if (isEmpty(value)) return null
    return Number.isFinite(Number(value))
      ? null
      : `${label} debe ser un número válido.`
  }
}

export function integer(label = 'Este campo'): Validator<string | number | null | undefined> {
  return (value) => {
    if (isEmpty(value)) return null
    const n = Number(value)
    if (!Number.isFinite(n)) return `${label} debe ser un número válido.`
    return Number.isInteger(n) ? null : `${label} debe ser un número entero (sin decimales).`
  }
}

export function min(
  minValue: number,
  label = 'Este valor',
): Validator<string | number | null | undefined> {
  return (value) => {
    if (isEmpty(value)) return null
    const n = Number(value)
    if (!Number.isFinite(n)) return null
    return n < minValue ? `${label} no puede ser menor a ${minValue}.` : null
  }
}

export function max(
  maxValue: number,
  label = 'Este valor',
): Validator<string | number | null | undefined> {
  return (value) => {
    if (isEmpty(value)) return null
    const n = Number(value)
    if (!Number.isFinite(n)) return null
    return n > maxValue ? `${label} no puede ser mayor a ${maxValue}.` : null
  }
}

export function between(
  minValue: number,
  maxValue: number,
  label = 'Este valor',
): Validator<string | number | null | undefined> {
  return (value) => {
    if (isEmpty(value)) return null
    const n = Number(value)
    if (!Number.isFinite(n)) return null
    if (n < minValue || n > maxValue) {
      return `${label} debe estar entre ${minValue} y ${maxValue}.`
    }
    return null
  }
}

export function positive(label = 'Este valor'): Validator<string | number | null | undefined> {
  return (value) => {
    if (isEmpty(value)) return null
    const n = Number(value)
    if (!Number.isFinite(n)) return null
    return n > 0 ? null : `${label} debe ser mayor a 0.`
  }
}

export function nonNegative(label = 'Este valor'): Validator<string | number | null | undefined> {
  return (value) => {
    if (isEmpty(value)) return null
    const n = Number(value)
    if (!Number.isFinite(n)) return null
    return n >= 0 ? null : `${label} no puede ser negativo.`
  }
}

export function digitsBetween(
  minDigits: number,
  maxDigits: number,
  label = 'Este campo',
): Validator<string | number | null | undefined> {
  return (value) => {
    if (isEmpty(value)) return null
    const digits = String(value).replace(/\D/g, '')
    if (digits.length < minDigits || digits.length > maxDigits) {
      return minDigits === maxDigits
        ? `${label} debe tener exactamente ${minDigits} dígitos.`
        : `${label} debe tener entre ${minDigits} y ${maxDigits} dígitos.`
    }
    return null
  }
}

export function timeHHmm(label = 'El horario'): Validator<string> {
  const re = /^([01]\d|2[0-3]):[0-5]\d$/
  return (value) => {
    if (isEmpty(value)) return null
    return re.test(value.trim())
      ? null
      : `${label} debe tener formato HH:mm (por ejemplo 18:30).`
  }
}

export function phone(label = 'El teléfono'): Validator<string> {
  const re = /^[+\d][\d\s\-()]{5,19}$/
  return (value) => {
    if (isEmpty(value)) return null
    const trimmed = value.trim()
    return re.test(trimmed)
      ? null
      : `${label} no es válido (entre 6 y 20 caracteres, puede incluir +, dígitos, espacios, guiones y paréntesis).`
  }
}

export function dateTime(label = 'La fecha'): Validator<string> {
  return (value) => {
    if (isEmpty(value)) return null
    const d = new Date(value)
    return Number.isNaN(d.getTime())
      ? `${label} no es una fecha y hora válidas.`
      : null
  }
}

export function notInFutureYears(
  maxFutureYears: number,
  label = 'La fecha',
): Validator<string> {
  return (value) => {
    if (isEmpty(value)) return null
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return null
    const limit = new Date()
    limit.setFullYear(limit.getFullYear() + maxFutureYears)
    return d.getTime() > limit.getTime()
      ? `${label} no puede ser posterior a ${limit.toLocaleDateString('es-AR')}.`
      : null
  }
}

export function oneOf<T>(allowed: readonly T[], label = 'Este campo'): Validator<T> {
  return (value) => {
    if (isEmpty(value)) return null
    return allowed.includes(value)
      ? null
      : `${label} debe ser uno de: ${allowed.join(', ')}.`
  }
}

export function nonEmptyArray(label = 'Esta lista'): Validator<unknown[]> {
  return (value) =>
    Array.isArray(value) && value.length > 0
      ? null
      : `${label} debe contener al menos un elemento.`
}

export function pattern(re: RegExp, message: string): Validator<string> {
  return (value) => {
    if (isEmpty(value)) return null
    return re.test(value) ? null : message
  }
}

/** Encadena validadores. Devuelve el primer error que aparezca. */
export function compose<T>(...validators: Validator<T>[]): Validator<T> {
  return (value) => {
    for (const v of validators) {
      const err = v(value)
      if (err) return err
    }
    return null
  }
}

/** Ejecuta el mapa de validadores y devuelve un objeto de errores por campo. */
export function runValidators<T extends Record<string, unknown>>(
  values: T,
  validators: ValidatorMap<T>,
): ValidationErrors {
  const errors: ValidationErrors = {}
  for (const key in validators) {
    const validator = validators[key]
    if (!validator) continue
    const err = validator(values[key])
    if (err) errors[key as string] = err
  }
  return errors
}
