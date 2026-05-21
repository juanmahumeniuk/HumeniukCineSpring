import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Clock, DollarSign, Grid3x3, Plus, Users } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { GenreBadge } from '../components/ui/GenreBadge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton'
import { EntityModal, FormField, inputClass } from '../components/ui/EntityModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { ApiTestPanel } from '../components/crud/ApiTestPanel'
import { EntradasCrudPanel } from '../components/crud/EntradasCrudPanel'
import { useViewById } from '../hooks/useViewById'
import { JsonDetailModal } from '../components/crud/JsonDetailModal'
import {
  cinesApi,
  entradasApi,
  funcionesApi,
  peliculasApi,
  salasApi,
  salasVipApi,
} from '../api/client'
import { useMutationFeedback } from '../hooks/useMutationFeedback'
import { useFormErrors } from '../hooks/useFormErrors'
import { compose, required, timeHHmm } from '../lib/validation'
import { calcOcupacion, formatCurrency, posterForPelicula, sumEntradasPrecio } from '../utils'
import { filterFuncionesByTab, joinFuncionesWithRefs } from '../utils/funciones'
import type { Funcion } from '../types'

type Tab = 'hoy' | 'semana' | 'todas'

export function FuncionesPage() {
  const feedback = useMutationFeedback()
  const viewById = useViewById()
  const { errors, validate, clearError, reset: resetErrors } = useFormErrors()
  const [tab, setTab] = useState<Tab>('todas')
  const funcionesQ = useQuery({ queryKey: ['funciones'], queryFn: funcionesApi.getAll })
  const peliculasQ = useQuery({ queryKey: ['peliculas'], queryFn: peliculasApi.getAll })
  const salasQ = useQuery({ queryKey: ['salas'], queryFn: salasApi.getAll })
  const vipQ = useQuery({ queryKey: ['salas-vip'], queryFn: salasVipApi.getAll })
  const entradasQ = useQuery({ queryKey: ['entradas'], queryFn: entradasApi.getAll })
  const cinesQ = useQuery({ queryKey: ['cines'], queryFn: cinesApi.getAll })

  const allSalas = useMemo(
    () => [...(salasQ.data ?? []), ...(vipQ.data ?? [])],
    [salasQ.data, vipQ.data],
  )

  // /api/salas oculta `cine` (@JsonIgnore). Reconstruimos el nombre del cine
  // de cada sala desde /api/cines, que sí expone su lista de salas.
  const cineNombrePorSala = useMemo(() => {
    const map = new Map<number, string>()
    for (const c of cinesQ.data ?? []) {
      for (const s of c.salas ?? []) {
        if (s.id != null) map.set(s.id, c.nombre)
      }
    }
    return map
  }, [cinesQ.data])

  function salaLabel(s: { id?: number; numero?: number }): string {
    const numero = s.numero != null ? `Sala ${s.numero}` : 'Sala —'
    const cine = s.id ? cineNombrePorSala.get(s.id) : undefined
    return cine ? `${numero} — ${cine}` : numero
  }

  const enriched = useMemo(
    () =>
      joinFuncionesWithRefs(
        funcionesQ.data ?? [],
        peliculasQ.data ?? [],
        allSalas,
        entradasQ.data ?? [],
      ),
    [funcionesQ.data, peliculasQ.data, allSalas, entradasQ.data],
  )

  const filtered = useMemo(
    () => filterFuncionesByTab(enriched, tab),
    [enriched, tab],
  )

  const [modalOpen, setModalOpen] = useState(false)
  const [entradasModal, setEntradasModal] = useState<Funcion | null>(null)
  const [editing, setEditing] = useState<Funcion | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [horario, setHorario] = useState('18:00')
  const [peliculaId, setPeliculaId] = useState<number | ''>('')
  const [salaId, setSalaId] = useState<number | ''>('')

  function closeModal() {
    setModalOpen(false)
    resetErrors()
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        horario,
        pelicula: peliculaId ? { id: Number(peliculaId) } : undefined,
        sala: salaId ? { id: Number(salaId) } : undefined,
      }
      if (editing?.id) return funcionesApi.update(editing.id, body)
      return funcionesApi.create(body)
    },
    onSuccess: feedback.onSaveSuccess(['funciones'], 'Función', !!editing, closeModal),
    onError: feedback.onSaveError('Función', !!editing),
  })

  function handleSubmit() {
    const ok = validate(
      { horario, pelicula: peliculaId, sala: salaId },
      {
        horario: compose(required('El horario'), timeHHmm('El horario')),
        pelicula: required('La película'),
        sala: required('La sala'),
      },
    )
    if (!ok) return
    saveMutation.mutate()
  }

  const deleteMutation = useMutation({
    mutationFn: (id: number) => funcionesApi.remove(id),
    onSuccess: feedback.onDeleteSuccess(['funciones'], 'Función', () => setDeleteId(null)),
    onError: feedback.onDeleteError('Función'),
  })

  const isLoading =
    funcionesQ.isLoading || peliculasQ.isLoading || salasQ.isLoading

  const tabs: { id: Tab; label: string }[] = [
    { id: 'hoy', label: 'Hoy' },
    { id: 'semana', label: 'Esta Semana' },
    { id: 'todas', label: 'Todas' },
  ]

  return (
    <>
      <PageHeader
        title="Funciones y Entradas"
        subtitle="Gestión de funciones del día"
        action={
          <Button
            onClick={() => {
              setEditing(null)
              setHorario('18:00')
              setPeliculaId('')
              setSalaId('')
              resetErrors()
              setModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Nueva función
          </Button>
        }
      />

      <ApiTestPanel label="funciones" api={funcionesApi} />

      <div className="glass-subtle mb-6 inline-flex gap-1 rounded-full p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`nav-pill rounded-full px-4 py-1.5 text-[13px] font-medium tracking-tight transition-colors ${
              tab === t.id ? 'is-active' : 'text-text-muted hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState message="No hay funciones para mostrar." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((f) => {
            const cap = f.sala?.capacidad ?? 100
            const entCount = f.entradas?.length ?? 0
            const pct = calcOcupacion(f.entradas, cap)
            const ingresos = sumEntradasPrecio(f.entradas)
            const isVip = vipQ.data?.some((v) => v.id === f.sala?.id)

            return (
              <article key={f.id} className="glass-card overflow-hidden p-0">
                <div className="relative">
                  <img
                    src={posterForPelicula(f.pelicula)}
                    alt=""
                    className="h-36 w-full object-cover"
                  />
                  {f.pelicula?.genero && (
                    <div className="absolute left-2 top-2">
                      <GenreBadge genero={f.pelicula.genero} />
                    </div>
                  )}
                  {isVip && (
                    <span className="absolute right-2 top-2 inline-flex items-center rounded-md border border-white/40 bg-gradient-to-b from-white to-[#d8d8df] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-black shadow-[0_4px_14px_-4px_rgba(255,255,255,0.5)]">
                      VIP
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white">
                    {f.pelicula?.titulo ?? 'Sin título'}
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-accent" />
                      {f.horario ?? '—'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Grid3x3 className="h-4 w-4 text-accent" />#
                      {f.sala?.numero ?? '—'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-accent" />
                      {pct}%
                    </span>
                    <span className="flex items-center gap-1 text-accent">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(ingresos)}
                    </span>
                  </div>
                  <div className="mt-3">
                    <ProgressBar
                      value={pct}
                      label={`${entCount} / ${cap} entradas`}
                    />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="ghost"
                      className="flex-1"
                      size="sm"
                      onClick={() => setEntradasModal(f)}
                    >
                      Gestionar entradas
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(f)
                        setHorario(f.horario ?? '')
                        setPeliculaId(f.pelicula?.id ?? '')
                        setSalaId(f.sala?.id ?? '')
                        resetErrors()
                        setModalOpen(true)
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        f.id &&
                        viewById.view(`GET /api/funciones/${f.id}`, () =>
                          funcionesApi.getById(f.id!),
                        )
                      }
                    >
                      Ver ID
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => f.id && setDeleteId(f.id)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <EntityModal
        open={modalOpen}
        title={editing ? 'Editar función' : 'Nueva función'}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={saveMutation.isPending}
        hasFieldErrors={Object.keys(errors).length > 0}
      >
        <FormField
          label="Horario"
          required
          error={errors.horario}
          hint="Formato 24 horas, HH:mm (por ejemplo 18:30)."
        >
          <input
            className={inputClass}
            value={horario}
            onChange={(e) => {
              setHorario(e.target.value)
              clearError('horario')
            }}
            placeholder="18:00"
          />
        </FormField>
        <FormField label="Película" required error={errors.pelicula}>
          <select
            className={inputClass}
            value={peliculaId}
            onChange={(e) => {
              setPeliculaId(e.target.value ? Number(e.target.value) : '')
              clearError('pelicula')
            }}
          >
            <option value="">Seleccionar</option>
            {(peliculasQ.data ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.titulo}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Sala" required error={errors.sala}>
          <select
            className={inputClass}
            value={salaId}
            onChange={(e) => {
              setSalaId(e.target.value ? Number(e.target.value) : '')
              clearError('sala')
            }}
          >
            <option value="">Seleccionar</option>
            {allSalas.map((s) => (
              <option key={s.id} value={s.id}>
                {salaLabel(s)}
              </option>
            ))}
          </select>
        </FormField>
      </EntityModal>

      <EntityModal
        open={!!entradasModal}
        title={`Entradas — ${entradasModal?.pelicula?.titulo ?? ''}`}
        onClose={() => setEntradasModal(null)}
        onSubmit={() => setEntradasModal(null)}
        submitLabel="Cerrar"
      >
        {entradasModal?.id && (
          <EntradasCrudPanel funcionId={entradasModal.id} />
        )}
      </EntityModal>

      <JsonDetailModal
        open={viewById.open}
        title={viewById.title}
        data={viewById.data}
        error={viewById.error}
        loading={viewById.loading}
        onClose={viewById.close}
      />

      <ConfirmDialog
        open={deleteId != null}
        message="¿Eliminar esta función?"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
