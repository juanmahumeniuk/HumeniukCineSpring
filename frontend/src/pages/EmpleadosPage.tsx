import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { DataTable } from '../components/ui/DataTable'
import type { Column } from '../components/ui/DataTable'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton'
import { EntityModal, FormField, inputClass } from '../components/ui/EntityModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { ApiTestPanel } from '../components/crud/ApiTestPanel'
import { RowCrudActions } from '../components/crud/RowCrudActions'
import { JsonDetailModal } from '../components/crud/JsonDetailModal'
import { useViewById } from '../hooks/useViewById'
import { empleadosApi } from '../api/client'
import type { Empleado } from '../types'

export function EmpleadosPage() {
  const qc = useQueryClient()
  const viewById = useViewById()
  const { data: empleados = [], isLoading } = useQuery({
    queryKey: ['empleados'],
    queryFn: empleadosApi.getAll,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Empleado | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [nombre, setNombre] = useState('')
  const [dni, setDni] = useState(0)

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = { nombre, dni }
      if (editing?.id) return empleadosApi.update(editing.id, body)
      return empleadosApi.create(body)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['empleados'] })
      setModalOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => empleadosApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['empleados'] })
      setDeleteId(null)
    },
  })

  const columns: Column<Empleado>[] = [
    { key: 'nombre', header: 'Nombre', render: (e) => e.nombre },
    { key: 'dni', header: 'DNI', render: (e) => e.dni },
    {
      key: 'cines',
      header: 'Cines',
      render: () => '—',
    },
  ]

  return (
    <>
      <PageHeader
        title="Empleados"
        subtitle="Gestión del personal del cine"
        action={
          <Button
            onClick={() => {
              setEditing(null)
              setNombre('')
              setDni(0)
              setModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Nuevo empleado
          </Button>
        }
      />

      <ApiTestPanel label="empleados" api={empleadosApi} />

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : empleados.length === 0 ? (
        <EmptyState message="No hay empleados registrados." />
      ) : (
        <DataTable
          columns={columns}
          data={empleados}
          keyExtractor={(e) => e.id ?? 0}
          actions={(e) => (
            <RowCrudActions
              onView={() =>
                e.id &&
                viewById.view(`GET /api/empleados/${e.id}`, () =>
                  empleadosApi.getById(e.id!),
                )
              }
              onEdit={() => {
                setEditing(e)
                setNombre(e.nombre)
                setDni(e.dni)
                setModalOpen(true)
              }}
              onDelete={() => e.id && setDeleteId(e.id)}
            />
          )}
        />
      )}

      <EntityModal
        open={modalOpen}
        title={editing ? 'Editar empleado' : 'Nuevo empleado'}
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
        <FormField label="DNI">
          <input
            type="number"
            className={inputClass}
            value={dni || ''}
            onChange={(e) => setDni(Number(e.target.value))}
            required
          />
        </FormField>
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
        message="¿Eliminar este empleado? (DELETE)"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
