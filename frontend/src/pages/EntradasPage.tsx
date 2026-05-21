import { useMemo, useState } from 'react'
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
import { entradasApi, funcionesApi } from '../api/client'
import { useMutationFeedback } from '../hooks/useMutationFeedback'
import { useFormErrors } from '../hooks/useFormErrors'
import {
  compose,
  max as maxValue,
  maxLength,
  positive,
  required,
} from '../lib/validation'
import { formatCurrency } from '../utils'
import type { Entrada } from '../types'

export function EntradasPage() {
  const feedback = useMutationFeedback()
  const viewById = useViewById()
  const { errors, validate, clearError, reset: resetErrors } = useFormErrors()
  const { data: entradas = [], isLoading } = useQuery({
    queryKey: ['entradas'],
    queryFn: entradasApi.getAll,
  })
  const funcionesQ = useQuery({ queryKey: ['funciones'], queryFn: funcionesApi.getAll })

  // /api/entradas oculta `funcion` (@JsonIgnore). Reconstruimos el ID desde
  // funciones, que exponen su lista de entradas.
  const funcionPorEntrada = useMemo(() => {
    const map = new Map<number, number>()
    for (const f of funcionesQ.data ?? []) {
      if (f.id == null) continue
      for (const e of f.entradas ?? []) {
        if (e.id != null) map.set(e.id, f.id)
      }
    }
    return map
  }, [funcionesQ.data])

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Entrada | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [precio, setPrecio] = useState(0)
  const [asiento, setAsiento] = useState('')
  const [funcionId, setFuncionId] = useState<number | ''>('')

  function closeModal() {
    setModalOpen(false)
    resetErrors()
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        precio,
        asiento,
        funcion: funcionId ? { id: Number(funcionId) } : undefined,
      }
      if (editing?.id) return entradasApi.update(editing.id, body)
      return entradasApi.create(body)
    },
    onSuccess: feedback.onSaveSuccess(
      [['entradas'], ['funciones']],
      'Entrada',
      !!editing,
      closeModal,
    ),
    onError: feedback.onSaveError('Entrada', !!editing),
  })

  function handleSubmit() {
    const ok = validate(
      { asiento, precio, funcion: funcionId },
      {
        asiento: compose(
          required('El asiento'),
          maxLength(10, 'El asiento'),
        ),
        precio: compose(
          required('El precio'),
          positive('El precio'),
          maxValue(1_000_000, 'El precio'),
        ),
        funcion: required('La función'),
      },
    )
    if (!ok) return
    saveMutation.mutate()
  }

  const deleteMutation = useMutation({
    mutationFn: (id: number) => entradasApi.remove(id),
    onSuccess: feedback.onDeleteSuccess(
      [['entradas'], ['funciones']],
      'Entrada',
      () => setDeleteId(null),
    ),
    onError: feedback.onDeleteError('Entrada'),
  })

  const columns: Column<Entrada>[] = [
    { key: 'id', header: 'ID', render: (e) => e.id ?? '—' },
    { key: 'asiento', header: 'Asiento', render: (e) => e.asiento },
    {
      key: 'precio',
      header: 'Precio',
      render: (e) => formatCurrency(e.precio),
    },
    {
      key: 'funcion',
      header: 'Función ID',
      render: (e) => {
        const fid = e.id ? funcionPorEntrada.get(e.id) : undefined
        return fid != null ? `#${fid}` : <span className="text-text-muted">—</span>
      },
    },
  ]

  function openCreate() {
    setEditing(null)
    setPrecio(0)
    setAsiento('')
    setFuncionId('')
    resetErrors()
    setModalOpen(true)
  }

  function openEdit(e: Entrada) {
    setEditing(e)
    setPrecio(e.precio)
    setAsiento(e.asiento)
    setFuncionId(e.id ? (funcionPorEntrada.get(e.id) ?? '') : '')
    resetErrors()
    setModalOpen(true)
  }

  return (
    <>
      <PageHeader
        title="Entradas"
        subtitle="CRUD completo — GET, POST, PUT, DELETE, /page"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nueva entrada
          </Button>
        }
      />

      <ApiTestPanel label="entradas" api={entradasApi} />

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : entradas.length === 0 ? (
        <EmptyState message="No hay entradas. Creá una con POST." />
      ) : (
        <DataTable
          columns={columns}
          data={entradas}
          keyExtractor={(e) => e.id ?? 0}
          actions={(e) => (
            <RowCrudActions
              onView={() =>
                e.id &&
                viewById.view(`GET /api/entradas/${e.id}`, () =>
                  entradasApi.getById(e.id!),
                )
              }
              onEdit={() => openEdit(e)}
              onDelete={() => e.id && setDeleteId(e.id)}
            />
          )}
        />
      )}

      <EntityModal
        open={modalOpen}
        title={editing ? 'Editar entrada (PUT)' : 'Nueva entrada (POST)'}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={saveMutation.isPending}
        hasFieldErrors={Object.keys(errors).length > 0}
      >
        <FormField
          label="Asiento"
          required
          error={errors.asiento}
          hint="Hasta 10 caracteres (por ejemplo: A12, B-07)."
        >
          <input
            className={inputClass}
            value={asiento}
            onChange={(ev) => {
              setAsiento(ev.target.value)
              clearError('asiento')
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
            onChange={(ev) => {
              setPrecio(Number(ev.target.value))
              clearError('precio')
            }}
          />
        </FormField>
        <FormField label="Función" required error={errors.funcion}>
          <select
            className={inputClass}
            value={funcionId}
            onChange={(ev) => {
              setFuncionId(ev.target.value ? Number(ev.target.value) : '')
              clearError('funcion')
            }}
          >
            <option value="">Seleccionar función</option>
            {(funcionesQ.data ?? []).map((f) => (
              <option key={f.id} value={f.id}>
                #{f.id} — {f.horario ?? 'sin horario'}
              </option>
            ))}
          </select>
        </FormField>
      </EntityModal>

      <ConfirmDialog
        open={deleteId != null}
        message="¿Eliminar esta entrada? (DELETE)"
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
