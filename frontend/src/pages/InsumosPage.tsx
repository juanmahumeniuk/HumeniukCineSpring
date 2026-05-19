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
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton'
import { EntityModal, FormField, inputClass } from '../components/ui/EntityModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useViewById } from '../hooks/useViewById'
import { insumosApi } from '../api/client'
import { formatCurrency } from '../utils'
import type { Insumo } from '../types'

export function InsumosPage() {
  const qc = useQueryClient()
  const viewById = useViewById()
  const { data: insumos = [], isLoading } = useQuery({
    queryKey: ['insumos'],
    queryFn: insumosApi.getAll,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Insumo | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState(0)

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = { nombre, precio }
      if (editing?.id) return insumosApi.update(editing.id, body)
      return insumosApi.create(body)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['insumos'] })
      setModalOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => insumosApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['insumos'] })
      setDeleteId(null)
    },
  })

  const columns: Column<Insumo>[] = [
    { key: 'id', header: 'ID', render: (i) => i.id ?? '—' },
    { key: 'nombre', header: 'Nombre', render: (i) => i.nombre },
    { key: 'precio', header: 'Precio', render: (i) => formatCurrency(i.precio) },
  ]

  return (
    <>
      <PageHeader
        title="Insumos"
        subtitle="CRUD completo — GET, POST, PUT, DELETE, /page"
        action={
          <Button
            onClick={() => {
              setEditing(null)
              setNombre('')
              setPrecio(0)
              setModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Nuevo insumo
          </Button>
        }
      />

      <ApiTestPanel label="insumos" api={insumosApi} />

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : insumos.length === 0 ? (
        <EmptyState message="No hay insumos registrados." />
      ) : (
        <DataTable
          columns={columns}
          data={insumos}
          keyExtractor={(i) => i.id ?? 0}
          actions={(i) => (
            <RowCrudActions
              onView={() =>
                i.id &&
                viewById.view(`GET /api/insumos/${i.id}`, () =>
                  insumosApi.getById(i.id!),
                )
              }
              onEdit={() => {
                setEditing(i)
                setNombre(i.nombre)
                setPrecio(i.precio)
                setModalOpen(true)
              }}
              onDelete={() => i.id && setDeleteId(i.id)}
            />
          )}
        />
      )}

      <EntityModal
        open={modalOpen}
        title={editing ? 'Editar insumo (PUT)' : 'Nuevo insumo (POST)'}
        onClose={() => setModalOpen(false)}
        onSubmit={() => saveMutation.mutate()}
        isSubmitting={saveMutation.isPending}
      >
        <FormField label="Nombre">
          <input
            className={inputClass}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Precio">
          <input
            type="number"
            className={inputClass}
            value={precio || ''}
            onChange={(e) => setPrecio(Number(e.target.value))}
            required
          />
        </FormField>
      </EntityModal>

      <ConfirmDialog
        open={deleteId != null}
        message="¿Eliminar este insumo? (DELETE)"
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
