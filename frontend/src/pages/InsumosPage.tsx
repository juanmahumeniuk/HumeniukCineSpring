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
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton'
import { EntityModal, FormField, inputClass } from '../components/ui/EntityModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useViewById } from '../hooks/useViewById'
import { insumosApi } from '../api/client'
import { useMutationFeedback } from '../hooks/useMutationFeedback'
import { useFormErrors } from '../hooks/useFormErrors'
import {
  compose,
  max as maxValue,
  maxLength,
  minLength,
  positive,
  required,
} from '../lib/validation'
import { formatCurrency } from '../utils'
import type { Insumo } from '../types'

export function InsumosPage() {
  const feedback = useMutationFeedback()
  const viewById = useViewById()
  const { errors, validate, clearError, reset: resetErrors } = useFormErrors()
  const { data: insumos = [], isLoading } = useQuery({
    queryKey: ['insumos'],
    queryFn: insumosApi.getAll,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Insumo | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState(0)

  function closeModal() {
    setModalOpen(false)
    resetErrors()
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = { nombre, precio }
      if (editing?.id) return insumosApi.update(editing.id, body)
      return insumosApi.create(body)
    },
    onSuccess: feedback.onSaveSuccess(['insumos'], 'Insumo', !!editing, closeModal),
    onError: feedback.onSaveError('Insumo', !!editing),
  })

  function handleSubmit() {
    const ok = validate(
      { nombre, precio },
      {
        nombre: compose(
          required('El nombre'),
          minLength(2, 'El nombre'),
          maxLength(80, 'El nombre'),
        ),
        precio: compose(
          required('El precio'),
          positive('El precio'),
          maxValue(10_000_000, 'El precio'),
        ),
      },
    )
    if (!ok) return
    saveMutation.mutate()
  }

  const deleteMutation = useMutation({
    mutationFn: (id: number) => insumosApi.remove(id),
    onSuccess: feedback.onDeleteSuccess(['insumos'], 'Insumo', () => setDeleteId(null)),
    onError: feedback.onDeleteError('Insumo'),
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
              resetErrors()
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
                resetErrors()
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
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={saveMutation.isPending}
        hasFieldErrors={Object.keys(errors).length > 0}
      >
        <FormField label="Nombre" required error={errors.nombre}>
          <input
            className={inputClass}
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value)
              clearError('nombre')
            }}
          />
        </FormField>
        <FormField label="Precio" required error={errors.precio}>
          <input
            type="number"
            min={0}
            step={0.01}
            className={inputClass}
            value={precio || ''}
            onChange={(e) => {
              setPrecio(Number(e.target.value))
              clearError('precio')
            }}
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
