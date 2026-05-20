import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
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
  comprasApi,
  insumosApi,
  proveedoresApi,
} from '../api/client'
import { useMutationFeedback } from '../hooks/useMutationFeedback'
import { formatCurrency, formatDateTime } from '../utils'
import type { Compra } from '../types'

export function ComprasPage() {
  const feedback = useMutationFeedback()
  const viewById = useViewById()
  const { selectedCine } = useCineContext()
  const { data: compras = [], isLoading } = useQuery({
    queryKey: ['compras'],
    queryFn: comprasApi.getAll,
  })
  const cinesQ = useQuery({ queryKey: ['cines'], queryFn: cinesApi.getAll })
  const insumosQ = useQuery({ queryKey: ['insumos'], queryFn: insumosApi.getAll })
  const proveedoresQ = useQuery({
    queryKey: ['proveedores'],
    queryFn: proveedoresApi.getAll,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Compra | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 16))
  const [cineId, setCineId] = useState<number | ''>('')
  const [insumoIds, setInsumoIds] = useState<number[]>([])
  const [proveedorIds, setProveedorIds] = useState<number[]>([])

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        fecha: new Date(fecha).toISOString(),
        cine: cineId ? { id: Number(cineId) } : undefined,
        insumos: insumoIds.map((id) => ({ id })),
        proveedores: proveedorIds.map((id) => ({ id })),
      }
      if (editing?.id) return comprasApi.update(editing.id, body)
      return comprasApi.create(body)
    },
    onSuccess: feedback.onSaveSuccess(['compras'], 'Compra', !!editing, () => setModalOpen(false)),
    onError: feedback.onSaveError('Compra', !!editing),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => comprasApi.remove(id),
    onSuccess: feedback.onDeleteSuccess(['compras'], 'Compra', () => setDeleteId(null)),
    onError: feedback.onDeleteError('Compra'),
  })

  const columns: Column<Compra>[] = [
    { key: 'id', header: 'ID', render: (c) => c.id ?? '—' },
    {
      key: 'fecha',
      header: 'Fecha',
      render: (c) => (c.fecha ? formatDateTime(c.fecha) : '—'),
    },
    {
      key: 'insumos',
      header: 'Insumos',
      render: (c) =>
        (c.insumos ?? []).map((i) => i.nombre).join(', ') || '—',
    },
    {
      key: 'proveedores',
      header: 'Proveedores',
      render: (c) =>
        (c.proveedores ?? []).map((p) => p.nombre).join(', ') || '—',
    },
    {
      key: 'total',
      header: 'Total insumos',
      render: (c) =>
        formatCurrency(
          (c.insumos ?? []).reduce((s, i) => s + (i.precio ?? 0), 0),
        ),
    },
  ]

  function openCreate() {
    setEditing(null)
    setFecha(new Date().toISOString().slice(0, 16))
    setCineId(selectedCine?.id ?? '')
    setInsumoIds([])
    setProveedorIds([])
    setModalOpen(true)
  }

  function openEdit(c: Compra) {
    setEditing(c)
    setFecha(c.fecha?.slice(0, 16) ?? '')
    setCineId(c.cine?.id ?? '')
    setInsumoIds((c.insumos ?? []).map((i) => i.id!).filter(Boolean))
    setProveedorIds((c.proveedores ?? []).map((p) => p.id!).filter(Boolean))
    setModalOpen(true)
  }

  return (
    <>
      <PageHeader
        title="Compras"
        subtitle="CRUD con relaciones insumos y proveedores"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nueva compra
          </Button>
        }
      />

      <ApiTestPanel label="compras" api={comprasApi} />

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : compras.length === 0 ? (
        <EmptyState message="No hay compras registradas." />
      ) : (
        <DataTable
          columns={columns}
          data={compras}
          keyExtractor={(c) => c.id ?? 0}
          actions={(c) => (
            <RowCrudActions
              onView={() =>
                c.id &&
                viewById.view(`GET /api/compras/${c.id}`, () =>
                  comprasApi.getById(c.id!),
                )
              }
              onEdit={() => openEdit(c)}
              onDelete={() => c.id && setDeleteId(c.id)}
            />
          )}
        />
      )}

      <EntityModal
        open={modalOpen}
        title={editing ? 'Editar compra (PUT)' : 'Nueva compra (POST)'}
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
        <FormField label="Insumos (Ctrl+clic para varios)">
          <MultiSelect
            options={(insumosQ.data ?? []).map((i) => ({
              id: i.id!,
              label: `${i.nombre} — ${formatCurrency(i.precio)}`,
            }))}
            value={insumoIds}
            onChange={setInsumoIds}
          />
        </FormField>
        <FormField label="Proveedores">
          <MultiSelect
            options={(proveedoresQ.data ?? []).map((p) => ({
              id: p.id!,
              label: p.nombre,
            }))}
            value={proveedorIds}
            onChange={setProveedorIds}
          />
        </FormField>
      </EntityModal>

      <ConfirmDialog
        open={deleteId != null}
        message="¿Eliminar esta compra? (DELETE)"
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
