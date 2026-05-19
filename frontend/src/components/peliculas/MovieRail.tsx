import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MovieRailProps {
  title: string
  count?: number
  children: ReactNode
}

export function MovieRail({ title, count, children }: MovieRailProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    function update() {
      if (!el) return
      setCanPrev(el.scrollLeft > 8)
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [children])

  function scrollBy(direction: 1 | -1) {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.85) * direction
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section className="group/rail relative mb-10">
      <div className="mb-3 flex items-end justify-between px-1">
        <div className="flex items-baseline gap-2">
          <h3 className="text-[19px] font-semibold tracking-tight text-white">
            {title}
          </h3>
          {typeof count === 'number' && count > 0 && (
            <span className="text-[12px] font-medium text-text-muted">
              {count}
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        {canPrev && (
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Desplazar a la izquierda"
            className="liquid-btn glass-strong absolute left-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white/85 opacity-0 transition-opacity duration-300 hover:text-white group-hover/rail:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {canNext && (
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Desplazar a la derecha"
            className="liquid-btn glass-strong absolute right-0 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white/85 opacity-0 transition-opacity duration-300 hover:text-white group-hover/rail:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* Edge fades */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#06060c] to-transparent transition-opacity duration-300 ${
            canPrev ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#06060c] to-transparent transition-opacity duration-300 ${
            canNext ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          ref={scrollerRef}
          className="rail-scroller flex gap-4 overflow-x-auto scroll-smooth pb-6 pt-3"
        >
          {children}
        </div>
      </div>
    </section>
  )
}
