import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { ApiTestPanel } from '../components/crud/ApiTestPanel'
import { RowCrudActions } from '../components/crud/RowCrudActions'
import { JsonDetailModal } from '../components/crud/JsonDetailModal'
import { Button } from '../components/ui/Button'
import { DataTable } from '../components/ui/DataTable'
import type { Column } from '../components/ui/DataTable'
import { MultiSelect } from '../components/ui/MultiSelect'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton'
import { EntityModal, FormField, inputClass } from '../components/ui/EntityModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useCineContext } from '../context/CineContext'
import { useViewById } from '../hooks/useViewById'
import {
  cinesApi,
  clientesApi,
  funcionesApi,
  pagosApi,
  ventasApi,
} from '../api/client'
import { formatCurrency, formatDateTime } from '../utils'
import type { Venta } from '../types'

export function VentasPage() {
  const qc = useQueryClient()
  const viewById = useViewById()
  const { selectedCine } = useCineContext()
  const { data: ventas = [], isLoading } = useQuery({
    queryKey: ['ventas'],
    queryFn: ventasApi.getAll,
  })
  const cinesQ = useQuery({ queryKey: ['cines'], queryFn: cinesApi.getAll })
  const clientesQ = useQuery({ queryKey: ['clientes'], queryFn: clientesApi.getAll })
  const pagosQ = useQuery({ queryKey: ['pagos'], queryFn: pagosApi.getAll })
  const funcionesQ = useQuery({ queryKey: ['funciones'], queryFn: funcionesApi.getAll })

  const filtered = selectedCine
    ? ventas.filter((v) => v.cine?.id === selectedCine.id || !v.cine)
    : ventas

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Venta | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 16))
  const [cineId, setCineId] = useState<number | ''>('')
  const [pagoId, setPagoId] = useState<number | ''>('')
  const [clienteId, setClienteId] = useState<number | ''>('')
  const [funcionIds, setFuncionIds] = useState<number[]>([])

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        fecha: new Date(fecha).toISOString(),
        cine: cineId ? { id: Number(cineId) } : undefined,
        pago: pagoId ? { id: Number(pagoId) } : undefined,
        clientes: clienteId ? [{ id: Number(clienteId) }] : [],
        funciones: funcionIds.map((id) => ({ id })),
      }
      if (editing?.id) return ventasApi.update(editing.id, body)
      return ventasApi.create(body)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ventas'] })
      setModalOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ventasApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ventas'] })
      setDeleteId(null)
    },
  })

  const columns: Column<Venta>[] = [
    { key: 'id', header: 'ID', render: (v) => v.id ?? '—' },
    {
      key: 'cliente',
      header: 'Cliente',
      render: (v) => v.clientes?.[0]?.nombre ?? '—',
    },
    {
      key: 'fecha',
      header: 'Fecha',
      render: (v) => (v.fecha ? formatDateTime(v.fecha) : '—'),
    },
    {
      key: 'funciones',
      header: 'Funciones',
      render: (v) => (v.funciones ?? []).length || '—',
    },
    {
      key: 'pago',
      header: 'Pago',
      render: (v) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            v.pago?.tipo === 'TARJETA'
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-green-500/20 text-green-400'
          }`}
        >
          {v.pago?.tipo === 'TARJETA' ? 'Tarjeta' : 'Efectivo'}
        </span>
      ),
    },
    {
      key: 'monto',
      header: 'Monto',
      render: (v) => (
        <span className="font-bold text-accent">
          {formatCurrency(v.pago?.monto ?? 0)}
        </span>
      ),
    },
  ]

  function openCreate() {
    setEditing(null)
    setFecha(new Date().toISOString().slice(0, 16))
    setCineId(selectedCine?.id ?? '')
    setPagoId('')
    setClienteId('')
    setFuncionIds([])
    setModalOpen(true)
  }

  function openEdit(v: Venta) {
    setEditing(v)
    setFecha(v.fecha?.slice(0, 16) ?? '')
    setCineId(v.cine?.id ?? '')
    setPagoId(v.pago?.id ?? '')
    setClienteId(v.clientes?.[0]?.id ?? '')
    setFuncionIds((v.funciones ?? []).map((f) => f.id!).filter(Boolean))
    setModalOpen(true)
  }

  return (
    <>
      <PageHeader
        title="Ventas"
        subtitle="CRUD con cine, pago, clientes y funciones"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nueva venta
          </Button>
        }
      />

      <ApiTestPanel label="ventas" api={ventasApi} />

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState message="No hay ventas registradas." />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(v) => v.id ?? 0}
          actions={(v) => (
            <RowCrudActions
              onView={() =>
                v.id &&
                viewById.view(`GET /api/ventas/${v.id}`, () =>
                  ventasApi.getById(v.id!),
                )
              }
              onEdit={() => openEdit(v)}
              onDelete={() => v.id && setDeleteId(v.id)}
            />
          )}
        />
      )}

      <EntityModal
        open={modalOpen}
        title={editing ? 'Editar venta (PUT)' : 'Nueva venta (POST)'}
        onClose={() => setModalOpen(false)}
        onSubmit={() => saveMutation.mutate()}
        isSubmitting={saveMutation.isPending}
      >
        <FormField label="Fecha y hora">
          <input
            type="datetime-local"
            className={inputClass}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
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
        <FormField label="Pago">
          <select
            className={inputClass}
            value={pagoId}
            onChange={(e) => setPagoId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Seleccionar</option>
            {(pagosQ.data ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {formatCurrency(p.monto)} — {p.tipo}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Cliente">
          <select
            className={inputClass}
            value={clienteId}
            onChange={(e) =>
              setClienteId(e.target.value ? Number(e.target.value) : '')
            }
          >
            <option value="">Seleccionar</option>
            {(clientesQ.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Funciones">
          <MultiSelect
            options={(funcionesQ.data ?? []).map((f) => ({
              id: f.id!,
              label: `#${f.id} ${f.horario ?? ''}`,
            }))}
            value={funcionIds}
            onChange={setFuncionIds}
          />
        </FormField>
      </EntityModal>

      <ConfirmDialog
        open={deleteId != null}
        message="¿Eliminar esta venta? (DELETE)"
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
