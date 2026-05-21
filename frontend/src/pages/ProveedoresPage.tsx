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
import { proveedoresApi } from '../api/client'
import { useMutationFeedback } from '../hooks/useMutationFeedback'
import { useFormErrors } from '../hooks/useFormErrors'
import {
  compose,
  maxLength,
  minLength,
  phone,
  required,
} from '../lib/validation'
import type { Proveedor } from '../types'

export function ProveedoresPage() {
  const feedback = useMutationFeedback()
  const viewById = useViewById()
  const { errors, validate, clearError, reset: resetErrors } = useFormErrors()
  const { data: proveedores = [], isLoading } = useQuery({
    queryKey: ['proveedores'],
    queryFn: proveedoresApi.getAll,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Proveedor | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')

  function closeModal() {
    setModalOpen(false)
    resetErrors()
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = { nombre, telefono, direccion }
      if (editing?.id) return proveedoresApi.update(editing.id, body)
      return proveedoresApi.create(body)
    },
    onSuccess: feedback.onSaveSuccess(['proveedores'], 'Proveedor', !!editing, closeModal),
    onError: feedback.onSaveError('Proveedor', !!editing),
  })

  function handleSubmit() {
    const ok = validate(
      { nombre, telefono, direccion },
      {
        nombre: compose(
          required('El nombre'),
          minLength(2, 'El nombre'),
          maxLength(80, 'El nombre'),
        ),
        telefono: compose(
          required('El teléfono'),
          phone('El teléfono'),
        ),
        direccion: compose(
          required('La dirección'),
          minLength(4, 'La dirección'),
          maxLength(120, 'La dirección'),
        ),
      },
    )
    if (!ok) return
    saveMutation.mutate()
  }

  const deleteMutation = useMutation({
    mutationFn: (id: number) => proveedoresApi.remove(id),
    onSuccess: feedback.onDeleteSuccess(['proveedores'], 'Proveedor', () => setDeleteId(null)),
    onError: feedback.onDeleteError('Proveedor'),
  })

  const columns: Column<Proveedor>[] = [
    { key: 'id', header: 'ID', render: (p) => p.id ?? '—' },
    { key: 'nombre', header: 'Nombre', render: (p) => p.nombre },
    { key: 'tel', header: 'Teléfono', render: (p) => p.telefono },
    { key: 'dir', header: 'Dirección', render: (p) => p.direccion },
  ]

  return (
    <>
      <PageHeader
        title="Proveedores"
        subtitle="CRUD completo — GET, POST, PUT, DELETE, /page"
        action={
          <Button
            onClick={() => {
              setEditing(null)
              setNombre('')
              setTelefono('')
              setDireccion('')
              resetErrors()
              setModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Nuevo proveedor
          </Button>
        }
      />

      <ApiTestPanel label="proveedores" api={proveedoresApi} />

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : proveedores.length === 0 ? (
        <EmptyState message="No hay proveedores registrados." />
      ) : (
        <DataTable
          columns={columns}
          data={proveedores}
          keyExtractor={(p) => p.id ?? 0}
          actions={(p) => (
            <RowCrudActions
              onView={() =>
                p.id &&
                viewById.view(`GET /api/proveedores/${p.id}`, () =>
                  proveedoresApi.getById(p.id!),
                )
              }
              onEdit={() => {
                setEditing(p)
                setNombre(p.nombre)
                setTelefono(p.telefono)
                setDireccion(p.direccion)
                resetErrors()
                setModalOpen(true)
              }}
              onDelete={() => p.id && setDeleteId(p.id)}
            />
          )}
        />
      )}

      <EntityModal
        open={modalOpen}
        title={editing ? 'Editar proveedor (PUT)' : 'Nuevo proveedor (POST)'}
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
        <FormField
          label="Teléfono"
          required
          error={errors.telefono}
          hint="Puede incluir +, dígitos, espacios, guiones y paréntesis."
        >
          <input
            className={inputClass}
            value={telefono}
            onChange={(e) => {
              setTelefono(e.target.value)
              clearError('telefono')
            }}
            placeholder="+54 11 5555-5555"
          />
        </FormField>
        <FormField label="Dirección" required error={errors.direccion}>
          <input
            className={inputClass}
            value={direccion}
            onChange={(e) => {
              setDireccion(e.target.value)
              clearError('direccion')
            }}
          />
        </FormField>
      </EntityModal>

      <ConfirmDialog
        open={deleteId != null}
        message="¿Eliminar este proveedor? (DELETE)"
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
