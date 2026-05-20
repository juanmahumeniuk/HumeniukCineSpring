import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '../ui/Button'
import { EntityModal, FormField, inputClass } from '../ui/EntityModal'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { RowCrudActions } from './RowCrudActions'
import { entradasApi } from '../../api/client'
import { useMutationFeedback } from '../../hooks/useMutationFeedback'
import { formatCurrency } from '../../utils'
import type { Entrada } from '../../types'

interface EntradasCrudPanelProps {
  funcionId: number
}

export function EntradasCrudPanel({ funcionId }: EntradasCrudPanelProps) {
  const feedback = useMutationFeedback()
  const { data: allEntradas = [] } = useQuery({
    queryKey: ['entradas'],
    queryFn: entradasApi.getAll,
  })

  const entradas = allEntradas

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Entrada | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [precio, setPrecio] = useState(0)
  const [asiento, setAsiento] = useState('')

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        precio,
        asiento,
        funcion: { id: funcionId },
      }
      if (editing?.id) return entradasApi.update(editing.id, body)
      return entradasApi.create(body)
    },
    onSuccess: feedback.onSaveSuccess(
      [['entradas'], ['funciones']],
      'Entrada',
      !!editing,
      () => setModalOpen(false),
    ),
    onError: feedback.onSaveError('Entrada', !!editing),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => entradasApi.remove(id),
    onSuccess: feedback.onDeleteSuccess(
      [['entradas'], ['funciones']],
      'Entrada',
      () => setDeleteId(null),
    ),
    onError: feedback.onDeleteError('Entrada'),
  })

  return (
    <div>
      <div className="mb-3 flex justify-between">
        <p className="text-sm text-text-muted">
          {entradas.length} entrada(s) — POST/PUT/DELETE /api/entradas
        </p>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null)
            setPrecio(0)
            setAsiento('')
            setModalOpen(true)
          }}
        >
          + Nueva entrada
        </Button>
      </div>

      <ul className="space-y-2">
        {entradas.length === 0 ? (
          <li className="text-sm text-text-muted">Sin entradas.</li>
        ) : (
          entradas.map((e) => (
            <li
              key={e.id}
              className="glass-subtle flex items-center justify-between rounded-xl px-3 py-2"
            >
              <span className="text-white">
                Asiento {e.asiento} — {formatCurrency(e.precio)}
              </span>
              <RowCrudActions
                onEdit={() => {
                  setEditing(e)
                  setPrecio(e.precio)
                  setAsiento(e.asiento)
                  setModalOpen(true)
                }}
                onDelete={() => e.id && setDeleteId(e.id)}
              />
            </li>
          ))
        )}
      </ul>

      <EntityModal
        open={modalOpen}
        title={editing ? 'Editar entrada' : 'Nueva entrada'}
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
      </EntityModal>

      <ConfirmDialog
        open={deleteId != null}
        message="¿Eliminar entrada?"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
