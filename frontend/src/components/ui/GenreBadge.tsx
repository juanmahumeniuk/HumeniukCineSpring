import type { Genero } from '../../types'
import { generoLabel } from '../../utils'

const styles: Record<Genero, string> = {
  ACCION:
    'text-red-300 bg-red-500/15 border-red-400/25 shadow-[0_0_18px_-6px_rgba(248,113,113,0.55)]',
  COMEDIA:
    'text-amber-200 bg-amber-400/15 border-amber-300/25 shadow-[0_0_18px_-6px_rgba(251,191,36,0.55)]',
  DRAMA:
    'text-violet-300 bg-violet-500/15 border-violet-400/25 shadow-[0_0_18px_-6px_rgba(167,139,250,0.55)]',
  SUSPENSO:
    'text-sky-300 bg-sky-500/15 border-sky-400/25 shadow-[0_0_18px_-6px_rgba(56,189,248,0.55)]',
}

export function GenreBadge({ genero }: { genero: Genero }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] backdrop-blur-md ${styles[genero]}`}
    >
      {generoLabel(genero)}
    </span>
  )
}
