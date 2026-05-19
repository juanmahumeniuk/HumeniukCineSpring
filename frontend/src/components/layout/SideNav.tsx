import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Building2,
  Calendar,
  ChevronDown,
  Clapperboard,
  Code2,
  CreditCard,
  Film,
  LayoutDashboard,
  MapPin,
  Package,
  ShoppingBag,
  ShoppingCart,
  Ticket,
  Truck,
  UserCircle,
  Users,
  X,
} from 'lucide-react'
import { useCineContext } from '../../context/CineContext'

type NavItem = {
  to: string
  label: string
  icon: typeof LayoutDashboard
}

type NavSection = {
  title?: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    items: [
      { to: '/', label: 'Películas', icon: Film },
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/funciones', label: 'Funciones', icon: Calendar },
      { to: '/cines', label: 'Cines', icon: Building2 },
      { to: '/salas', label: 'Salas', icon: Clapperboard },
    ],
  },
  {
    title: 'Operaciones',
    items: [
      { to: '/ventas', label: 'Ventas', icon: ShoppingCart },
      { to: '/compras', label: 'Compras', icon: ShoppingBag },
      { to: '/entradas', label: 'Entradas', icon: Ticket },
      { to: '/pagos', label: 'Pagos', icon: CreditCard },
      { to: '/clientes', label: 'Clientes', icon: Users },
    ],
  },
  {
    title: 'Gestión',
    items: [
      { to: '/empleados', label: 'Empleados', icon: UserCircle },
      { to: '/insumos', label: 'Insumos', icon: Package },
      { to: '/proveedores', label: 'Proveedores', icon: Truck },
    ],
  },
  {
    title: 'Herramientas',
    items: [{ to: '/api-explorer', label: 'API Explorer', icon: Code2 }],
  },
]

interface SideNavProps {
  open: boolean
  onClose: () => void
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('es-AR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function SideNav({ open, onClose }: SideNavProps) {
  const { cines, selectedCine, setSelectedCineId } = useCineContext()
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const id = window.setInterval(() => setTime(formatTime(new Date())), 30_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div
        className={`tv-sidebar-backdrop ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        id="app-sidebar"
        className={`tv-sidebar ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
        aria-label="Menú de navegación"
      >
        <div className="tv-sidebar-panel glass-strong">
          <div className="tv-sidebar-header">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5e9eff] via-[#0a84ff] to-[#0a6cd1] text-[13px] font-semibold text-white shadow-[0_6px_18px_-6px_rgba(10,132,255,0.65)] ring-1 ring-white/15">
                MG
              </div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[15px] font-semibold tracking-tight text-white">
                  María González
                </p>
                <p className="text-[12px] text-text-muted">{time}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="liquid-btn tv-sidebar-close flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-muted hover:text-white"
              aria-label="Cerrar menú"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="tv-sidebar-nav">
            {navSections.map((section, si) => (
              <div key={si} className="tv-sidebar-section">
                {section.title && (
                  <p className="tv-sidebar-section-title">{section.title}</p>
                )}
                <ul className="space-y-0.5">
                  {section.items.map(({ to, label, icon: Icon }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        end={to === '/'}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `sidebar-nav-item ${isActive ? 'is-active' : ''}`
                        }
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0 stroke-[1.75]" />
                        <span>{label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="tv-sidebar-footer">
            <label
              htmlFor="sidebar-cine-select"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted"
            >
              Cine activo
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
              <select
                id="sidebar-cine-select"
                className="glass-input w-full appearance-none py-2 pl-9 pr-9 text-[13px]"
                value={selectedCine?.id ?? ''}
                onChange={(e) =>
                  setSelectedCineId(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
              >
                {cines.length === 0 && <option value="">Sin cines</option>}
                {cines.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
