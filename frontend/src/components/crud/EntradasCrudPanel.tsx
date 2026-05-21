import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '../ui/Button'
import { EntityModal, FormField, inputClass } from '../ui/EntityModal'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { RowCrudActions } from './RowCrudActions'
import { entradasApi } from '../../api/client'
import { useMutationFeedback } from '../../hooks/useMutationFeedback'
import { useFormErrors } from '../../hooks/useFormErrors'
import {
  compose,
  max as maxValue,
  maxLength,
  positive,
  required,
} from '../../lib/validation'
import { formatCurrency } from '../../utils'
import type { Entrada } from '../../types'

interface EntradasCrudPanelProps {
  funcionId: number
}

export function EntradasCrudPanel({ funcionId }: EntradasCrudPanelProps) {
  const feedback = useMutationFeedback()
  const { errors, validate, clearError, reset: resetErrors } = useFormErrors()
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

  function closeModal() {
    setModalOpen(false)
    resetErrors()
  }

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
      closeModal,
    ),
    onError: feedback.onSaveError('Entrada', !!editing),
  })

  function handleSubmit() {
    const ok = validate(
      { asiento, precio },
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
            resetErrors()
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
                  resetErrors()
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
