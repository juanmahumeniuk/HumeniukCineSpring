import { Menu, Film } from 'lucide-react'
import { useScrollTop } from '../../hooks/useScrollTop'

interface AppHeaderProps {
  onMenuOpen: () => void
  menuOpen?: boolean
}

export function AppHeader({ onMenuOpen, menuOpen = false }: AppHeaderProps) {
  const { scrolled, fade } = useScrollTop(8)

  return (
    <header
      className={`app-header ${scrolled ? 'is-scrolled' : ''}`}
      style={{ '--header-fade': fade } as React.CSSProperties}
    >
      <div className="app-header-scrim" aria-hidden />
      <div className="app-header-bar">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-4 lg:px-8">
          <button
            type="button"
            onClick={onMenuOpen}
            className="liquid-btn glass-strong flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white/90 hover:text-white"
            aria-label="Abrir menú"
            aria-controls="app-sidebar"
            aria-expanded={menuOpen}
          >
            <Menu className="h-5 w-5" strokeWidth={2} />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white via-[#f4f4f7] to-[#c8c8d0] shadow-[0_6px_18px_-8px_rgba(255,255,255,0.35)] ring-1 ring-white/30">
              <Film className="h-[18px] w-[18px] text-black/85" strokeWidth={2.5} />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[15px] font-semibold tracking-tight text-white">
                Humeniuk Cine
              </p>
              <p className="text-[10px] uppercase tracking-[0.12em] text-text-muted">
                Admin Panel
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
