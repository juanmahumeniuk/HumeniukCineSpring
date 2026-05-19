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
import { pagosApi } from '../api/client'
import { formatCurrency } from '../utils'
import type { Pago, TipoPago } from '../types'

const TIPOS: TipoPago[] = ['TARJETA', 'EFECTIVO']

export function PagosPage() {
  const qc = useQueryClient()
  const viewById = useViewById()
  const { data: pagos = [], isLoading } = useQuery({
    queryKey: ['pagos'],
    queryFn: pagosApi.getAll,
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Pago | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [monto, setMonto] = useState(0)
  const [tipo, setTipo] = useState<TipoPago>('EFECTIVO')

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = { monto, tipo }
      if (editing?.id) return pagosApi.update(editing.id, body)
      return pagosApi.create(body)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pagos'] })
      setModalOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => pagosApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pagos'] })
      setDeleteId(null)
    },
  })

  const columns: Column<Pago>[] = [
    { key: 'id', header: 'ID', render: (p) => p.id ?? '—' },
    { key: 'monto', header: 'Monto', render: (p) => formatCurrency(p.monto) },
    { key: 'tipo', header: 'Tipo', render: (p) => p.tipo },
  ]

  return (
    <>
      <PageHeader
        title="Pagos"
        subtitle="CRUD completo — GET, POST, PUT, DELETE, /page"
        action={
          <Button
            onClick={() => {
              setEditing(null)
              setMonto(0)
              setTipo('EFECTIVO')
              setModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Nuevo pago
          </Button>
        }
      />

      <ApiTestPanel label="pagos" api={pagosApi} />

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : pagos.length === 0 ? (
        <EmptyState message="No hay pagos registrados." />
      ) : (
        <DataTable
          columns={columns}
          data={pagos}
          keyExtractor={(p) => p.id ?? 0}
          actions={(p) => (
            <RowCrudActions
              onView={() =>
                p.id &&
                viewById.view(`GET /api/pagos/${p.id}`, () => pagosApi.getById(p.id!))
              }
              onEdit={() => {
                setEditing(p)
                setMonto(p.monto)
                setTipo(p.tipo)
                setModalOpen(true)
              }}
              onDelete={() => p.id && setDeleteId(p.id)}
            />
          )}
        />
      )}

      <EntityModal
        open={modalOpen}
        title={editing ? 'Editar pago (PUT)' : 'Nuevo pago (POST)'}
        onClose={() => setModalOpen(false)}
        onSubmit={() => saveMutation.mutate()}
        isSubmitting={saveMutation.isPending}
      >
        <FormField label="Monto">
          <input
            type="number"
            className={inputClass}
            value={monto || ''}
            onChange={(e) => setMonto(Number(e.target.value))}
            required
          />
        </FormField>
        <FormField label="Tipo">
          <select
            className={inputClass}
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoPago)}
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </FormField>
      </EntityModal>

      <ConfirmDialog
        open={deleteId != null}
        message="¿Eliminar este pago? (DELETE)"
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
