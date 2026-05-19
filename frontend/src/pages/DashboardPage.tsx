import { Link } from 'react-router-dom'
import { Calendar, DollarSign, Package, Ticket } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { GenreBadge } from '../components/ui/GenreBadge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton'
import { useDashboardData, getFuncionOcupacion, getVentaClienteNombre } from '../hooks/useDashboard'
import { formatCurrency, formatDateTime } from '../utils'
import { useQuery } from '@tanstack/react-query'
import { salasApi, salasVipApi } from '../api/client'

export function DashboardPage() {
  const { isLoading, stats, ultimasVentas, proximasFunciones } = useDashboardData()
  const salas = useQuery({ queryKey: ['salas'], queryFn: salasApi.getAll })
  const salasVip = useQuery({ queryKey: ['salas-vip'], queryFn: salasVipApi.getAll })
  const allSalas = [...(salas.data ?? []), ...(salasVip.data ?? [])]

  if (isLoading) return <LoadingSkeleton rows={4} />

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen de operaciones del día"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Ventas Hoy"
          value={formatCurrency(stats.ventasHoy)}
          subtext={`${stats.transaccionesHoy} transacciones`}
          icon={DollarSign}
        />
        <StatCard
          label="Entradas Vendidas"
          value={stats.entradasVendidas}
          subtext={`${stats.funcionesHoy} funciones`}
          icon={Ticket}
        />
        <StatCard
          label="Funciones Hoy"
          value={stats.funcionesHoy}
          subtext={`${stats.peliculasDistintas} películas distintas`}
          icon={Calendar}
        />
        <StatCard
          label="Compras Recientes"
          value={stats.comprasRecientes}
          subtext={`${formatCurrency(stats.comprasTotal)} total`}
          icon={Package}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Próximas Funciones</h2>
            <Link to="/funciones">
              <Button variant="outline" size="sm">
                Ver todas
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {proximasFunciones.length === 0 ? (
              <p className="text-text-muted">No hay funciones programadas.</p>
            ) : (
              proximasFunciones.map((f) => {
                const { pct } = getFuncionOcupacion(f, allSalas)
                return (
                  <div
                    key={f.id}
                    className="glass-card p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">
                            {f.pelicula?.titulo ?? 'Sin título'}
                          </h3>
                          {f.pelicula?.genero && (
                            <GenreBadge genero={f.pelicula.genero} />
                          )}
                        </div>
                        <p className="mt-1 text-sm text-text-muted">
                          Sala {f.sala?.numero ?? '—'} • {f.horario ?? '—'}
                        </p>
                      </div>
                      <Link to="/funciones">
                        <Button variant="outline" size="sm">
                          Ver entradas
                        </Button>
                      </Link>
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={pct} label="Ocupación" />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-white">Últimas Ventas</h2>
          <div className="glass-card space-y-3 p-4">
            {ultimasVentas.length === 0 ? (
              <p className="text-text-muted">Sin ventas registradas.</p>
            ) : (
              ultimasVentas.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-white">
                      {getVentaClienteNombre(v)}
                    </p>
                    <p className="text-xs text-text-muted">
                      {v.fecha ? formatDateTime(v.fecha) : '—'}
                    </p>
                    {v.pago?.tipo && (
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                          v.pago.tipo === 'TARJETA'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {v.pago.tipo === 'TARJETA' ? 'Tarjeta' : 'Efectivo'}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-accent">
                    {formatCurrency(v.pago?.monto ?? 0)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
