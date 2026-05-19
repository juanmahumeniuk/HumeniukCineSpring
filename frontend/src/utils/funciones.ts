import type { Entrada, Funcion, Pelicula, Sala } from '../types'

export function joinFuncionesWithRefs(
  funciones: Funcion[],
  peliculas: Pelicula[],
  salas: Sala[],
  entradasAll: Entrada[],
): Funcion[] {
  const pelById = new Map(peliculas.filter((p) => p.id != null).map((p) => [p.id!, p]))
  const salaById = new Map(salas.filter((s) => s.id != null).map((s) => [s.id!, s]))

  return funciones.map((f) => {
    const pelId = resolveId(f.pelicula)
    const salaId = resolveId(f.sala)
    const entradas =
      f.entradas?.length
        ? f.entradas
        : entradasAll.filter((e) => resolveId((e as Entrada & { funcion?: { id?: number } }).funcion) === f.id)

    return {
      ...f,
      pelicula: f.pelicula?.titulo ? f.pelicula : pelId ? pelById.get(pelId) : undefined,
      sala: f.sala?.numero != null ? f.sala : salaId ? salaById.get(salaId) : undefined,
      entradas,
    }
  })
}

function resolveId(ref?: { id?: number } | null): number | undefined {
  return ref?.id
}

export function filterFuncionesByTab(
  funciones: Funcion[],
  tab: 'hoy' | 'semana' | 'todas',
): Funcion[] {
  if (tab === 'todas') return funciones
  const now = new Date()
  const today = now.toDateString()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)

  return funciones.filter((f) => {
    if (!f.horario) return true
    const parts = f.horario.match(/(\d{1,2}):(\d{2})/)
    const d = new Date()
    if (parts) {
      d.setHours(parseInt(parts[1], 10), parseInt(parts[2], 10), 0, 0)
    }
    if (tab === 'hoy') return d.toDateString() === today
    if (tab === 'semana') return d >= weekStart && d < weekEnd
    return true
  })
}
