import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'
import { AppHeader } from './AppHeader'
import { SideNav } from './SideNav'

export function AppLayout() {
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)

  const isPeliculaDetail = /^\/peliculas\/\d+$/.test(location.pathname)

  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!navOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [navOpen])

  return (
    <div className="relative min-h-screen">
      {!isPeliculaDetail && (
        <>
          <div className="ambient-bg" aria-hidden>
            <div className="ambient-orb ambient-orb-cyan" />
          </div>
          <div className="ambient-grain" aria-hidden />
        </>
      )}

      <SideNav open={navOpen} onClose={() => setNavOpen(false)} />

      <AppHeader
        onMenuOpen={() => setNavOpen(true)}
        menuOpen={navOpen}
      />

      <main
        key={location.pathname}
        className={`relative mx-auto max-w-[1400px] px-4 lg:px-8 ${
          isPeliculaDetail ? 'py-0' : 'fade-in py-6'
        }`}
      >
        <Outlet />
      </main>

      <button
        type="button"
        className="liquid-btn glass-strong fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full text-white/80 hover:text-white"
        title="Ayuda"
        aria-label="Ayuda"
      >
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  )
}
