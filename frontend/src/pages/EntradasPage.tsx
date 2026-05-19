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
import { entradasApi, funcionesApi } from '../api/client'
import { formatCurrency } from '../utils'
import type { Entrada } from '../types'

export function EntradasPage() {
  const qc = useQueryClient()
  const viewById = useViewById()
  const { data: entradas = [], isLoading } = useQuery({
    queryKey: ['entradas'],
    queryFn: entradasApi.getAll,
  })
  const funcionesQ = useQuery({ queryKey: ['funciones'], queryFn: funcionesApi.getAll })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Entrada | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [precio, setPrecio] = useState(0)
  const [asiento, setAsiento] = useState('')
  const [funcionId, setFuncionId] = useState<number | ''>('')

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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entradas'] })
      qc.invalidateQueries({ queryKey: ['funciones'] })
      setModalOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => entradasApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['entradas'] })
      setDeleteId(null)
    },
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
      render: (e) =>
        (e as Entrada & { funcion?: { id?: number } }).funcion?.id ?? '—',
    },
  ]

  function openCreate() {
    setEditing(null)
    setPrecio(0)
    setAsiento('')
    setFuncionId('')
    setModalOpen(true)
  }

  function openEdit(e: Entrada) {
    setEditing(e)
    setPrecio(e.precio)
    setAsiento(e.asiento)
    setFuncionId((e as Entrada & { funcion?: { id?: number } }).funcion?.id ?? '')
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
        onClose={() => setModalOpen(false)}
        onSubmit={() => saveMutation.mutate()}
        isSubmitting={saveMutation.isPending}
      >
        <FormField label="Asiento">
          <input
            className={inputClass}
            value={asiento}
            onChange={(ev) => setAsiento(ev.target.value)}
            required
          />
        </FormField>
        <FormField label="Precio">
          <input
            type="number"
            className={inputClass}
            value={precio || ''}
            onChange={(ev) => setPrecio(Number(ev.target.value))}
            required
          />
        </FormField>
        <FormField label="Función">
          <select
            className={inputClass}
            value={funcionId}
            onChange={(ev) =>
              setFuncionId(ev.target.value ? Number(ev.target.value) : '')
            }
          >
            <option value="">Sin función</option>
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
