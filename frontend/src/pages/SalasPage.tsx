import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Plus, Users } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { Button } from '../components/ui/Button'
import { DataTable } from '../components/ui/DataTable'
import type { Column } from '../components/ui/DataTable'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton'
import { EntityModal, FormField, inputClass } from '../components/ui/EntityModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { ApiTestPanel } from '../components/crud/ApiTestPanel'
import { JsonDetailModal } from '../components/crud/JsonDetailModal'
import { useViewById } from '../hooks/useViewById'
import { useCineContext } from '../context/CineContext'
import {
  cinesApi,
  funcionesApi,
  peliculasApi,
  salasApi,
  salasVipApi,
} from '../api/client'
import { useMutationFeedback } from '../hooks/useMutationFeedback'
import { mergeSalas } from '../utils'
import { joinFuncionesWithRefs } from '../utils/funciones'
import type { SalaMerged } from '../types'

export function SalasPage() {
  const feedback = useMutationFeedback()
  const viewById = useViewById()
  const { selectedCine } = useCineContext()
  const salasQ = useQuery({ queryKey: ['salas'], queryFn: salasApi.getAll })
  const vipQ = useQuery({ queryKey: ['salas-vip'], queryFn: salasVipApi.getAll })
  const funcionesQ = useQuery({ queryKey: ['funciones'], queryFn: funcionesApi.getAll })
  const peliculasQ = useQuery({
    queryKey: ['peliculas'],
    queryFn: peliculasApi.getAll,
  })

  const merged = useMemo(() => {
    let list = mergeSalas(salasQ.data ?? [], vipQ.data ?? [])
    if (selectedCine?.id) {
      list = list.filter((s) => {
        const cineId = (s as SalaMerged & { cine?: { id?: number } }).cine?.id
        return !cineId || cineId === selectedCine.id
      })
    }
    return list
  }, [salasQ.data, vipQ.data, selectedCine])

  const funciones = useMemo(
    () =>
      joinFuncionesWithRefs(
        funcionesQ.data ?? [],
        peliculasQ.data ?? [],
        merged,
        [],
      ),
    [funcionesQ.data, peliculasQ.data, merged],
  )

  const enUso = merged.filter((s) =>
    funciones.some((f) => f.sala?.id === s.id),
  ).length

  const capacidadTotal = merged.reduce((a, s) => a + s.capacidad, 0)

  const [modalOpen, setModalOpen] = useState(false)
  const [isVip, setIsVip] = useState(false)
  const [editing, setEditing] = useState<SalaMerged | null>(null)
  const [deleteId, setDeleteId] = useState<{ id: number; vip: boolean } | null>(null)
  const [numero, setNumero] = useState(1)
  const [capacidad, setCapacidad] = useState(100)
  const [beneficios, setBeneficios] = useState('')
  const [cineId, setCineId] = useState<number | ''>('')
  const cinesQ = useQuery({ queryKey: ['cines'], queryFn: cinesApi.getAll })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const cine = cineId ? { id: Number(cineId) } : selectedCine ? { id: selectedCine.id } : undefined
      if (isVip) {
        const body = { numero, capacidad, beneficios, cine }
        if (editing?.id) return salasVipApi.update(editing.id, body)
        return salasVipApi.create(body)
      }
      const body = { numero, capacidad, cine }
      if (editing?.id) return salasApi.update(editing.id, body)
      return salasApi.create(body)
    },
    onSuccess: feedback.onSaveSuccess(
      [['salas'], ['salas-vip']],
      isVip ? 'Sala VIP' : 'Sala',
      !!editing,
      () => setModalOpen(false),
    ),
    onError: feedback.onSaveError(isVip ? 'Sala VIP' : 'Sala', !!editing),
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id, vip }: { id: number; vip: boolean }) =>
      vip ? salasVipApi.remove(id) : salasApi.remove(id),
    onSuccess: feedback.onDeleteSuccess(
      [['salas'], ['salas-vip']],
      isVip ? 'Sala VIP' : 'Sala',
      () => setDeleteId(null),
    ),
    onError: feedback.onDeleteError(isVip ? 'Sala VIP' : 'Sala'),
  })

  const columns: Column<SalaMerged>[] = [
    {
      key: 'sala',
      header: 'Sala',
      render: (s) => (
        <span>
          <span className="text-accent">{s.numero}</span>{' '}
          <span className="text-white">Sala {s.numero}</span>
        </span>
      ),
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (s) => (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] backdrop-blur-md ${
            s.isVip
              ? 'border-white/45 bg-gradient-to-b from-white to-[#d8d8df] text-black shadow-[0_4px_14px_-4px_rgba(255,255,255,0.5)]'
              : 'border-white/10 bg-white/[0.05] text-white/80'
          }`}
        >
          {s.isVip ? 'VIP' : 'Normal'}
        </span>
      ),
    },
    {
      key: 'cap',
      header: 'Capacidad',
      render: (s) => (
        <span className="flex items-center gap-1 text-white">
          <Users className="h-4 w-4 text-text-muted" />
          {s.capacidad}
        </span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (s) => {
        const uso = funciones.some((f) => f.sala?.id === s.id)
        return (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] backdrop-blur-md ${
              uso
                ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300 shadow-[0_0_16px_-6px_rgba(52,211,153,0.55)]'
                : 'border-white/10 bg-white/[0.04] text-text-muted'
            }`}
          >
            {uso ? 'En uso' : 'Disponible'}
          </span>
        )
      },
    },
    {
      key: 'funcion',
      header: 'Función Actual',
      render: (s) => {
        const f = funciones.find((fn) => fn.sala?.id === s.id)
        return (
          <span className="text-white">
            {f
              ? `${f.pelicula?.titulo ?? '—'} ${f.horario ?? ''}`
              : '—'}
          </span>
        )
      },
    },
    {
      key: 'vip',
      header: 'Beneficios VIP',
      render: (s) => (
        <span className="text-text-muted">{s.beneficios ?? '—'}</span>
      ),
    },
  ]

  const isLoading = salasQ.isLoading || vipQ.isLoading

  return (
    <>
      <PageHeader
        title="Salas y Salas VIP"
        subtitle="Gestión de salas de proyección"
        action={
          <Button
            onClick={() => {
              setEditing(null)
              setIsVip(false)
              setNumero(1)
              setCapacidad(100)
              setBeneficios('')
              setCineId(selectedCine?.id ?? '')
              setModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Nueva sala
          </Button>
        }
      />

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <ApiTestPanel label="salas" api={salasApi} />
        <ApiTestPanel label="salas-vip" api={salasVipApi} />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total de Salas" value={merged.length} />
        <StatCard
          label="Salas VIP"
          value={merged.filter((s) => s.isVip).length}
          valueClassName="text-accent"
        />
        <StatCard label="En Uso" value={enUso} valueClassName="text-success" />
        <StatCard label="Capacidad Total" value={capacidadTotal} />
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : merged.length === 0 ? (
        <EmptyState message="No hay salas registradas." />
      ) : (
        <DataTable
          columns={columns}
          data={merged}
          keyExtractor={(s) => `${s.isVip}-${s.id}`}
          actions={(s) => (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  s.id &&
                  viewById.view(
                    `GET /api/${s.isVip ? 'salas-vip' : 'salas'}/${s.id}`,
                    () =>
                      s.isVip
                        ? salasVipApi.getById(s.id!)
                        : salasApi.getById(s.id!),
                  )
                }
              >
                Ver ID
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditing(s)
                  setIsVip(s.isVip)
                  setNumero(s.numero)
                  setCapacidad(s.capacidad)
                  setBeneficios(s.beneficios ?? '')
                  setModalOpen(true)
                }}
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => s.id && setDeleteId({ id: s.id, vip: s.isVip })}
              >
                Eliminar
              </Button>
            </div>
          )}
        />
      )}

      <EntityModal
        open={modalOpen}
        title={editing ? 'Editar sala' : 'Nueva sala'}
        onClose={() => setModalOpen(false)}
        onSubmit={() => saveMutation.mutate()}
        isSubmitting={saveMutation.isPending}
      >
        <FormField label="Tipo">
          <select
            className={inputClass}
            value={isVip ? 'vip' : 'normal'}
            onChange={(e) => setIsVip(e.target.value === 'vip')}
            disabled={!!editing}
          >
            <option value="normal">Normal</option>
            <option value="vip">VIP</option>
          </select>
        </FormField>
        <FormField label="Cine">
          <select
            className={inputClass}
            value={cineId}
            onChange={(e) => setCineId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Seleccionar</option>
            {(cinesQ.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Número">
          <input
            type="number"
            className={inputClass}
            value={numero}
            onChange={(e) => setNumero(Number(e.target.value))}
          />
        </FormField>
        <FormField label="Capacidad">
          <input
            type="number"
            className={inputClass}
            value={capacidad}
            onChange={(e) => setCapacidad(Number(e.target.value))}
          />
        </FormField>
        {isVip && (
          <FormField label="Beneficios VIP">
            <input
              className={inputClass}
              value={beneficios}
              onChange={(e) => setBeneficios(e.target.value)}
            />
          </FormField>
        )}
      </EntityModal>

      <ConfirmDialog
        open={deleteId != null}
        message="¿Eliminar esta sala? (DELETE)"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />

      <JsonDetailModal
        open={viewById.open}
        title={viewById.title}
        data={viewById.data}
        error={viewById.error}
        loading={viewById.loading}
        onClose={viewById.close}
      />
    </>
  )
}
