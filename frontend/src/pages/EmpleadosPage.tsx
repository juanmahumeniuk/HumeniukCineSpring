import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
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
import { cinesApi, empleadosApi } from '../api/client'
import { useMutationFeedback } from '../hooks/useMutationFeedback'
import { useFormErrors } from '../hooks/useFormErrors'
import {
  compose,
  digitsBetween,
  integer,
  maxLength,
  minLength,
  positive,
  required,
} from '../lib/validation'
import type { Empleado } from '../types'

export function EmpleadosPage() {
  const feedback = useMutationFeedback()
  const viewById = useViewById()
  const { errors, validate, clearError, reset: resetErrors } = useFormErrors()
  const { data: empleados = [], isLoading } = useQuery({
    queryKey: ['empleados'],
    queryFn: empleadosApi.getAll,
  })
  const { data: cines = [] } = useQuery({
    queryKey: ['cines'],
    queryFn: cinesApi.getAll,
  })

  // /api/empleados oculta `cines` (@JsonIgnore). Reconstruimos la relación
  // desde el lado de Cine, que sí expone su lista de empleados.
  const cinesPorEmpleado = useMemo(() => {
    const map = new Map<number, string[]>()
    for (const cine of cines) {
      for (const emp of cine.empleados ?? []) {
        if (emp.id == null) continue
        const arr = map.get(emp.id) ?? []
        arr.push(cine.nombre)
        map.set(emp.id, arr)
      }
    }
    return map
  }, [cines])

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Empleado | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [nombre, setNombre] = useState('')
  const [dni, setDni] = useState('')

  function closeModal() {
    setModalOpen(false)
    resetErrors()
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = { nombre, dni: Number(dni) }
      if (editing?.id) return empleadosApi.update(editing.id, body)
      return empleadosApi.create(body)
    },
    onSuccess: feedback.onSaveSuccess(['empleados'], 'Empleado', !!editing, closeModal),
    onError: feedback.onSaveError('Empleado', !!editing),
  })

  function handleSubmit() {
    const ok = validate(
      { nombre, dni },
      {
        nombre: compose(
          required('El nombre'),
          minLength(2, 'El nombre'),
          maxLength(80, 'El nombre'),
        ),
        dni: compose(
          required('El DNI'),
          integer('El DNI'),
          positive('El DNI'),
          digitsBetween(7, 9, 'El DNI'),
        ),
      },
    )
    if (!ok) return
    saveMutation.mutate()
  }

  const deleteMutation = useMutation({
    mutationFn: (id: number) => empleadosApi.remove(id),
    onSuccess: feedback.onDeleteSuccess(['empleados'], 'Empleado', () => setDeleteId(null)),
    onError: feedback.onDeleteError('Empleado'),
  })

  const columns: Column<Empleado>[] = [
    { key: 'nombre', header: 'Nombre', render: (e) => e.nombre },
    { key: 'dni', header: 'DNI', render: (e) => e.dni },
    {
      key: 'cines',
      header: 'Cines',
      render: (e) => {
        const nombres = e.id ? (cinesPorEmpleado.get(e.id) ?? []) : []
        if (nombres.length === 0) return <span className="text-text-muted">—</span>
        return (
          <div className="flex flex-wrap gap-1">
            {nombres.map((n) => (
              <span key={n} className="glass-badge text-white/90">
                {n}
              </span>
            ))}
          </div>
        )
      },
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
              setDni('')
              resetErrors()
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
                setDni(String(e.dni))
                resetErrors()
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
          label="DNI"
          required
          error={errors.dni}
          hint="Sólo dígitos, entre 7 y 9 caracteres."
        >
          <input
            type="number"
            className={inputClass}
            value={dni}
            onChange={(e) => {
              setDni(e.target.value)
              clearError('dni')
            }}
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
