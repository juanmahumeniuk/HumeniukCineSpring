import type { Genero, Pelicula } from '../types'
import manifest from '../data/movie-art-manifest.json'

const MEDIA_MOVIES = '/media/movies'
const MEDIA_FALLBACK = '/media/fallback'

interface MovieArt {
  poster: string
  backdrop: string
}

function tmdbIdFromPath(path: string): string {
  return path.replace(/^\//, '').replace(/\.jpg$/i, '')
}

function localTmdb(path: string, size: 'w500' | 'w1280'): string {
  return `${MEDIA_MOVIES}/${tmdbIdFromPath(path)}-${size}.jpg`
}

const FALLBACK_PORTRAIT: Record<Genero, string> = {
  ACCION: `${MEDIA_FALLBACK}/accion-portrait.jpg`,
  COMEDIA: `${MEDIA_FALLBACK}/comedia-portrait.jpg`,
  DRAMA: `${MEDIA_FALLBACK}/drama-portrait.jpg`,
  SUSPENSO: `${MEDIA_FALLBACK}/suspenso-portrait.jpg`,
}

const FALLBACK_BACKDROP: Record<Genero, string> = {
  ACCION: `${MEDIA_FALLBACK}/accion-backdrop.jpg`,
  COMEDIA: `${MEDIA_FALLBACK}/comedia-backdrop.jpg`,
  DRAMA: `${MEDIA_FALLBACK}/drama-backdrop.jpg`,
  SUSPENSO: `${MEDIA_FALLBACK}/suspenso-backdrop.jpg`,
}

function fallbackPortrait(genero?: Genero): string {
  return genero ? FALLBACK_PORTRAIT[genero] : FALLBACK_PORTRAIT.DRAMA
}

function fallbackBackdrop(genero?: Genero): string {
  return genero ? FALLBACK_BACKDROP[genero] : FALLBACK_BACKDROP.DRAMA
}

/** Título exacto del seed → rutas locales (ver `npm run media:download`). */
const ART_BY_TITLE: Record<string, MovieArt> = Object.fromEntries(
  Object.entries(manifest.movies).map(([title, path]) => [
    title,
    {
      poster: localTmdb(path, 'w500'),
      backdrop: localTmdb(path, 'w1280'),
    },
  ]),
)

function normalizeTitle(titulo: string): string {
  return titulo.trim().toLowerCase()
}

function lookupArt(titulo?: string): MovieArt | undefined {
  if (!titulo) return undefined
  const exact = ART_BY_TITLE[titulo.trim()]
  if (exact) return exact

  const norm = normalizeTitle(titulo)
  for (const [key, artEntry] of Object.entries(ART_BY_TITLE)) {
    if (normalizeTitle(key) === norm) return artEntry
  }
  return undefined
}

export function posterForPelicula(pelicula?: Pick<Pelicula, 'titulo' | 'genero'>): string {
  const found = lookupArt(pelicula?.titulo)
  return found?.poster ?? fallbackPortrait(pelicula?.genero)
}

export function backdropForPelicula(pelicula?: Pick<Pelicula, 'titulo' | 'genero'>): string {
  const found = lookupArt(pelicula?.titulo)
  return found?.backdrop ?? fallbackBackdrop(pelicula?.genero)
}

/** Alias semántico para tarjetas verticales del catálogo */
export function portraitForPelicula(pelicula?: Pick<Pelicula, 'titulo' | 'genero'>): string {
  return posterForPelicula(pelicula)
}

/** Portada en alta resolución local (w1280). */
export function posterOriginalForPelicula(
  pelicula?: Pick<Pelicula, 'titulo' | 'genero'>,
): string {
  const found = lookupArt(pelicula?.titulo)
  if (found) return found.backdrop
  return fallbackBackdrop(pelicula?.genero)
}

/** Fondo cinematográfico en alta resolución local. */
export function backdropOriginalForPelicula(
  pelicula?: Pick<Pelicula, 'titulo' | 'genero'>,
): string {
  return posterOriginalForPelicula(pelicula)
}

/** Rutas locales por género (dashboard / placeholders). */
export const LOCAL_GENRE_POSTERS: Record<Genero, string> = {
  ACCION: `${MEDIA_FALLBACK}/accion-genre-poster.jpg`,
  COMEDIA: `${MEDIA_FALLBACK}/comedia-genre-poster.jpg`,
  DRAMA: `${MEDIA_FALLBACK}/drama-genre-poster.jpg`,
  SUSPENSO: `${MEDIA_FALLBACK}/suspenso-genre-poster.jpg`,
}

export const LOCAL_GENRE_BACKDROPS = FALLBACK_BACKDROP
export const LOCAL_GENRE_PORTRAITS = FALLBACK_PORTRAIT
export const LOCAL_CINE_PLACEHOLDER = `${MEDIA_FALLBACK}/cine-placeholder.jpg`
