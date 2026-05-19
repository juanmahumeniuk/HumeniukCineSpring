import { Eye, Pencil, Ticket, Trash2 } from 'lucide-react'
import { GenreBadge } from '../ui/GenreBadge'
import { formatPuntaje, portraitForPelicula } from '../../utils'
import type { Pelicula } from '../../types'

interface MoviePosterCardProps {
  pelicula: Pelicula
  funcionesCount: number
  onOpen?: () => void
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function MoviePosterCard({
  pelicula,
  funcionesCount,
  onOpen,
  onView,
  onEdit,
  onDelete,
}: MoviePosterCardProps) {
  return (
    <article className="group relative w-[180px] shrink-0 sm:w-[200px]">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus:ring-2 focus:ring-white/40 group-hover:-translate-y-1.5 group-hover:scale-[1.04] group-hover:border-white/25 group-hover:shadow-[0_28px_60px_-18px_rgba(0,0,0,0.85)]"
        aria-label={`Ver ${pelicula.titulo}`}
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={portraitForPelicula(pelicula)}
            alt={`Portada de ${pelicula.titulo}`}
            className="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
            loading="lazy"
            draggable={false}
          />

          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/55 to-transparent"
          />

          <div className="absolute left-2 top-2">
            <GenreBadge genero={pelicula.genero} />
          </div>

          {funcionesCount > 0 && (
            <span className="glass-badge absolute right-2 top-2 text-white/90">
              <Ticket className="h-3 w-3" />
              {funcionesCount}
            </span>
          )}

          <div className="absolute inset-x-3 bottom-3">
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-tight tracking-tight text-white">
              {pelicula.titulo}
            </h3>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[11px] text-white/60">
              {pelicula.anio != null && <span>{pelicula.anio}</span>}
              {pelicula.puntaje != null && (
                <span className="text-amber-300/90">★ {formatPuntaje(pelicula.puntaje)}</span>
              )}
              <span className="w-full">
                {funcionesCount > 0
                  ? `${funcionesCount} ${funcionesCount === 1 ? 'función activa' : 'funciones activas'}`
                  : 'Sin funciones'}
              </span>
            </p>
          </div>
        </div>
      </button>

      <div className="pointer-events-none absolute right-2 top-2 z-10 flex flex-col gap-1.5 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
        {onView && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onView()
            }}
            className="liquid-btn glass-strong flex h-7 w-7 items-center justify-center rounded-full text-white/85 hover:text-white"
            aria-label="Ver JSON"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        )}
        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="liquid-btn glass-strong flex h-7 w-7 items-center justify-center rounded-full text-white/85 hover:text-white"
            aria-label="Editar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="liquid-btn flex h-7 w-7 items-center justify-center rounded-full border border-danger/40 bg-danger/25 text-white backdrop-blur-xl hover:bg-danger/45"
            aria-label="Eliminar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </article>
  )
}
