import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Pencil, Play, Ticket } from 'lucide-react'
import { Button } from '../ui/Button'
import { GenreBadge } from '../ui/GenreBadge'
import {
  backdropForPelicula,
  descripcionHero,
  formatPuntaje,
  gradientHintForGenero,
} from '../../utils'
import type { Pelicula } from '../../types'

interface MoviesHeroProps {
  peliculas: Pelicula[]
  funcionesPorPelicula: Map<number, number>
  onOpen?: (p: Pelicula) => void
  onPlay?: (p: Pelicula) => void
  onEdit?: (p: Pelicula) => void
  autoPlayMs?: number
}

export function MoviesHero({
  peliculas,
  funcionesPorPelicula,
  onOpen,
  onPlay,
  onEdit,
  autoPlayMs = 6500,
}: MoviesHeroProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const total = peliculas.length

  const go = useCallback(
    (delta: number) => {
      if (total === 0) return
      setIndex((i) => (i + delta + total) % total)
    },
    [total],
  )

  const jumpTo = useCallback(
    (i: number) => {
      if (total === 0) return
      setIndex(((i % total) + total) % total)
    },
    [total],
  )

  useEffect(() => {
    if (paused || total < 2) return
    timeoutRef.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % total)
    }, autoPlayMs)
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [index, paused, total, autoPlayMs])

  if (total === 0) return null

  return (
    <section
      aria-roledescription="carousel"
      className="glass-card relative isolate mb-10 h-[460px] overflow-hidden rounded-[28px] p-0 sm:h-[520px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Stacked backdrops, cross-fade between them */}
      <div className="absolute inset-0">
        {peliculas.map((p, i) => {
          const active = i === index
          return (
            <div
              key={p.id ?? `slot-${i}`}
              aria-hidden={!active}
              className={`absolute inset-0 transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                active ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={backdropForPelicula(p)}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-screen opacity-70"
                style={{ background: gradientHintForGenero(p.genero) }}
              />
            </div>
          )
        })}
      </div>

      {/* Cinematic overlays: bottom vignette + left text scrim */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/40 to-transparent"
      />

      {/* Text content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-10 lg:p-14">
        {peliculas.map((p, i) => {
          const active = i === index
          const funcionesCount = funcionesPorPelicula.get(p.id ?? 0) ?? 0
          const descripcion = descripcionHero(p)
          return (
            <div
              key={`text-${p.id ?? i}`}
              aria-hidden={!active}
              className={`max-w-2xl transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                active
                  ? 'pointer-events-auto translate-y-0 opacity-100'
                  : 'pointer-events-none absolute inset-x-6 bottom-6 translate-y-4 opacity-0 sm:inset-x-10 sm:bottom-10 lg:inset-x-14 lg:bottom-14'
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                <GenreBadge genero={p.genero} />
                <span className="glass-badge text-white/85">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                  En cartelera
                </span>
                {funcionesCount > 0 && (
                  <span className="glass-badge text-white/85">
                    <Ticket className="h-3 w-3" />
                    {funcionesCount}{' '}
                    {funcionesCount === 1 ? 'función' : 'funciones'}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => p.id && onOpen?.(p)}
                className="heading-display block max-w-full text-left text-[40px] leading-[1.02] transition-opacity hover:opacity-90 sm:text-[56px] lg:text-[68px]"
              >
                {p.titulo}
              </button>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-white/70">
                {p.anio != null && <span>{p.anio}</span>}
                {p.anio != null && p.duracionMinutos != null && (
                  <span aria-hidden>·</span>
                )}
                {p.duracionMinutos != null && <span>{p.duracionMinutos} min</span>}
                {p.puntaje != null && (
                  <>
                    <span aria-hidden>·</span>
                    <span className="font-medium text-amber-300">
                      ★ {formatPuntaje(p.puntaje)}
                    </span>
                  </>
                )}
                {p.clasificacion && (
                  <>
                    <span aria-hidden>·</span>
                    <span className="glass-badge py-0.5 text-[11px]">{p.clasificacion}</span>
                  </>
                )}
              </div>

              {descripcion && (
                <p
                  className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-white/75 sm:text-[15.5px]"
                  title={p.descripcion?.trim()}
                >
                  {descripcion}
                </p>
              )}
              {p.director && (
                <p className="mt-1.5 text-[12px] text-white/50">Dir. {p.director}</p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Button onClick={() => onOpen?.(p)}>
                  <Play className="h-4 w-4 fill-current" strokeWidth={0} />
                  Ver película
                </Button>
                <Button variant="outline" onClick={() => onPlay?.(p)}>
                  <Ticket className="h-3.5 w-3.5" />
                  Funciones
                </Button>
                <Button variant="outline" onClick={() => onEdit?.(p)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Prev / next */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Anterior"
            className="liquid-btn glass-strong absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white/85 hover:text-white sm:left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Siguiente"
            className="liquid-btn glass-strong absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white/85 hover:text-white sm:right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots / progress */}
      {total > 1 && (
        <div
          className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-1.5"
          role="tablist"
          aria-label="Películas destacadas"
        >
          {peliculas.map((p, i) => {
            const active = i === index
            return (
              <button
                key={`dot-${p.id ?? i}`}
                type="button"
                onClick={() => jumpTo(i)}
                role="tab"
                aria-selected={active}
                aria-label={`Ir a ${p.titulo}`}
                className={`relative h-1.5 overflow-hidden rounded-full bg-white/25 transition-all duration-500 ${
                  active ? 'w-10' : 'w-1.5 hover:bg-white/40'
                }`}
              >
                {active && (
                  <span
                    key={`fill-${index}-${paused ? 'p' : 'r'}`}
                    className="absolute inset-y-0 left-0 block w-full origin-left bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                    style={{
                      animation: paused
                        ? 'none'
                        : `hero-fill ${autoPlayMs}ms linear forwards`,
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
