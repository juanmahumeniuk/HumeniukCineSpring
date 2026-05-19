import type { Entrada, Genero, Sala, SalaVIP, SalaMerged } from '../types'
import {
  LOCAL_CINE_PLACEHOLDER,
  LOCAL_GENRE_BACKDROPS,
  LOCAL_GENRE_PORTRAITS,
  LOCAL_GENRE_POSTERS,
} from './moviePosters'

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function isToday(dateStr: string): boolean {
  const d = new Date(dateStr)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

export function calcOcupacion(entradas: Entrada[] | undefined, capacidad: number): number {
  if (!capacidad) return 0
  const count = entradas?.length ?? 0
  return Math.min(100, Math.round((count / capacidad) * 100))
}

export function sumEntradasPrecio(entradas: Entrada[] | undefined): number {
  return (entradas ?? []).reduce((s, e) => s + (e.precio ?? 0), 0)
}

export function mergeSalas(salas: Sala[], salasVip: SalaVIP[]): SalaMerged[] {
  const vipIds = new Set(salasVip.map((s) => s.id))
  const normal = salas
    .filter((s) => !vipIds.has(s.id))
    .map((s) => ({ ...s, isVip: false as const }))
  const vip = salasVip.map((s) => ({
    ...s,
    isVip: true as const,
    beneficios: s.beneficios,
  }))
  return [...normal, ...vip].sort((a, b) => a.numero - b.numero)
}

const GENRE_POSTERS = LOCAL_GENRE_POSTERS
const GENRE_BACKDROPS = LOCAL_GENRE_BACKDROPS
const GENRE_PORTRAITS = LOCAL_GENRE_PORTRAITS

const GENRE_TAGLINES: Record<Genero, string> = {
  ACCION:
    'Adrenalina pura, persecuciones imposibles y una historia que no te deja respirar.',
  COMEDIA:
    'Una comedia luminosa sobre lo absurdo de la vida y los momentos que la hacen valer.',
  DRAMA:
    'Una historia íntima sobre el amor, la pérdida y todo lo que queda en el medio.',
  SUSPENSO:
    'Nada es lo que parece. Cada respuesta abre una pregunta más oscura.',
}

const GENRE_GRADIENT_HINTS: Record<Genero, string> = {
  ACCION:
    'radial-gradient(900px 600px at 25% 50%, rgba(244,63,94,0.45), transparent 65%), radial-gradient(800px 500px at 80% 30%, rgba(251,113,133,0.25), transparent 60%)',
  COMEDIA:
    'radial-gradient(900px 600px at 25% 50%, rgba(251,191,36,0.45), transparent 65%), radial-gradient(800px 500px at 80% 30%, rgba(245,158,11,0.3), transparent 60%)',
  DRAMA:
    'radial-gradient(900px 600px at 25% 50%, rgba(167,139,250,0.45), transparent 65%), radial-gradient(800px 500px at 80% 30%, rgba(124,58,237,0.3), transparent 60%)',
  SUSPENSO:
    'radial-gradient(900px 600px at 25% 50%, rgba(56,189,248,0.42), transparent 65%), radial-gradient(800px 500px at 80% 30%, rgba(99,102,241,0.3), transparent 60%)',
}

export function posterForGenero(genero?: Genero): string {
  return genero ? GENRE_POSTERS[genero] : GENRE_POSTERS.DRAMA
}

export function backdropForGenero(genero?: Genero): string {
  return genero ? GENRE_BACKDROPS[genero] : GENRE_BACKDROPS.DRAMA
}

export function portraitForGenero(genero?: Genero): string {
  return genero ? GENRE_PORTRAITS[genero] : GENRE_PORTRAITS.DRAMA
}

export function taglineForGenero(genero?: Genero): string {
  return genero ? GENRE_TAGLINES[genero] : GENRE_TAGLINES.DRAMA
}

export function gradientHintForGenero(genero?: Genero): string {
  return genero ? GENRE_GRADIENT_HINTS[genero] : GENRE_GRADIENT_HINTS.DRAMA
}

export const CINE_PLACEHOLDER = LOCAL_CINE_PLACEHOLDER

export function formatPuntaje(puntaje?: number): string {
  if (puntaje == null || Number.isNaN(puntaje)) return '—'
  return puntaje.toFixed(1)
}

/** Longitud máxima de la sinopsis en el banner principal */
export const HERO_DESCRIPCION_MAX = 100

export function truncateWithEllipsis(text: string, maxLength: number): string {
  const normalized = text.trim().replace(/\s+/g, ' ')
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength).trimEnd()}...`
}

export function descripcionHero(
  pelicula?: { descripcion?: string | null },
): string | null {
  const desc = pelicula?.descripcion?.trim()
  if (!desc) return null
  return truncateWithEllipsis(desc, HERO_DESCRIPCION_MAX)
}

export function generoLabel(g: Genero): string {
  const labels: Record<Genero, string> = {
    ACCION: 'Acción',
    COMEDIA: 'Comedia',
    DRAMA: 'Drama',
    SUSPENSO: 'Suspenso',
  }
  return labels[g] ?? g
}

export {
  posterForPelicula,
  backdropForPelicula,
  backdropOriginalForPelicula,
  portraitForPelicula,
  posterOriginalForPelicula,
} from './moviePosters'
