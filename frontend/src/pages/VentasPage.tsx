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
import { MultiSelect } from '../components/ui/MultiSelect'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton'
import { EntityModal, FormField, inputClass } from '../components/ui/EntityModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useCineContext } from '../context/CineContext'
import { useViewById } from '../hooks/useViewById'
import {
  cinesApi,
  clientesApi,
  funcionesApi,
  ventasApi,
} from '../api/client'
import { useMutationFeedback } from '../hooks/useMutationFeedback'
import { useFormErrors } from '../hooks/useFormErrors'
import {
  compose,
  dateTime,
  max as maxValue,
  nonEmptyArray,
  notInFutureYears,
  oneOf,
  positive,
  required,
} from '../lib/validation'
import { formatCurrency, formatDateTime } from '../utils'
import type { TipoPago, Venta } from '../types'

const TIPOS_PAGO: TipoPago[] = ['TARJETA', 'EFECTIVO']

export function VentasPage() {
  const feedback = useMutationFeedback()
  const viewById = useViewById()
  const { errors, validate, clearError, reset: resetErrors } = useFormErrors()
  const { selectedCine } = useCineContext()
  const { data: ventas = [], isLoading } = useQuery({
    queryKey: ['ventas'],
    queryFn: ventasApi.getAll,
  })
  const cinesQ = useQuery({ queryKey: ['cines'], queryFn: cinesApi.getAll })
  const clientesQ = useQuery({ queryKey: ['clientes'], queryFn: clientesApi.getAll })
  const funcionesQ = useQuery({ queryKey: ['funciones'], queryFn: funcionesApi.getAll })

  const filtered = selectedCine
    ? ventas.filter((v) => v.cine?.id === selectedCine.id || !v.cine)
    : ventas

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Venta | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 16))
  const [cineId, setCineId] = useState<number | ''>('')
  const [pagoMonto, setPagoMonto] = useState<number | ''>('')
  const [pagoTipo, setPagoTipo] = useState<TipoPago>('EFECTIVO')
  const [clienteId, setClienteId] = useState<number | ''>('')
  const [funcionIds, setFuncionIds] = useState<number[]>([])

  function closeModal() {
    setModalOpen(false)
    resetErrors()
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      // El Pago es 1-1 con la Venta y JPA tiene cascade=ALL, por lo que
      // creamos/actualizamos el Pago de forma anidada dentro del body de Venta.
      // En edición preservamos el id del pago para que se actualice en lugar
      // de crearse uno nuevo (y dejar huérfano al anterior).
      const pagoBody: { id?: number; monto: number; tipo: TipoPago } = {
        monto: Number(pagoMonto),
        tipo: pagoTipo,
      }
      if (editing?.pago?.id != null) pagoBody.id = editing.pago.id

      const body = {
        fecha: new Date(fecha).toISOString(),
        cine: cineId ? { id: Number(cineId) } : undefined,
        pago: pagoBody,
        clientes: clienteId ? [{ id: Number(clienteId) }] : [],
        funciones: funcionIds.map((id) => ({ id })),
      }
      if (editing?.id) return ventasApi.update(editing.id, body)
      return ventasApi.create(body)
    },
    onSuccess: feedback.onSaveSuccess(
      [['ventas'], ['pagos']],
      'Venta',
      !!editing,
      closeModal,
    ),
    onError: feedback.onSaveError('Venta', !!editing),
  })

  function handleSubmit() {
    const ok = validate(
      {
        fecha,
        cine: cineId,
        pagoMonto,
        pagoTipo,
        cliente: clienteId,
        funciones: funcionIds,
      },
      {
        fecha: compose(
          required('La fecha'),
          dateTime('La fecha'),
          notInFutureYears(1, 'La fecha'),
        ),
        cine: required('El cine'),
        pagoMonto: compose(
          required('El monto del pago'),
          positive('El monto del pago'),
          maxValue(10_000_000, 'El monto del pago'),
        ),
        pagoTipo: compose(
          required('El método de pago'),
          oneOf(TIPOS_PAGO, 'El método de pago'),
        ),
        cliente: required('El cliente'),
        funciones: nonEmptyArray('Las funciones'),
      },
    )
    if (!ok) return
    saveMutation.mutate()
  }

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ventasApi.remove(id),
    onSuccess: feedback.onDeleteSuccess(['ventas'], 'Venta', () => setDeleteId(null)),
    onError: feedback.onDeleteError('Venta'),
  })

  const columns: Column<Venta>[] = [
    { key: 'id', header: 'ID', render: (v) => v.id ?? '—' },
    {
      key: 'cliente',
      header: 'Cliente',
      render: (v) => v.clientes?.[0]?.nombre ?? '—',
    },
    {
      key: 'fecha',
      header: 'Fecha',
      render: (v) => (v.fecha ? formatDateTime(v.fecha) : '—'),
    },
    {
      key: 'funciones',
      header: 'Funciones',
      render: (v) => (v.funciones ?? []).length || '—',
    },
    {
      key: 'pago',
      header: 'Pago',
      render: (v) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            v.pago?.tipo === 'TARJETA'
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-green-500/20 text-green-400'
          }`}
        >
          {v.pago?.tipo === 'TARJETA' ? 'Tarjeta' : 'Efectivo'}
        </span>
      ),
    },
    {
      key: 'monto',
      header: 'Monto',
      render: (v) => (
        <span className="font-bold text-accent">
          {formatCurrency(v.pago?.monto ?? 0)}
        </span>
      ),
    },
  ]

  function openCreate() {
    setEditing(null)
    setFecha(new Date().toISOString().slice(0, 16))
    setCineId(selectedCine?.id ?? '')
    setPagoMonto('')
    setPagoTipo('EFECTIVO')
    setClienteId('')
    setFuncionIds([])
    resetErrors()
    setModalOpen(true)
  }

  function openEdit(v: Venta) {
    setEditing(v)
    setFecha(v.fecha?.slice(0, 16) ?? '')
    setCineId(v.cine?.id ?? '')
    setPagoMonto(v.pago?.monto ?? '')
    setPagoTipo(v.pago?.tipo ?? 'EFECTIVO')
    setClienteId(v.clientes?.[0]?.id ?? '')
    setFuncionIds((v.funciones ?? []).map((f) => f.id!).filter(Boolean))
    resetErrors()
    setModalOpen(true)
  }

  function funcionLabel(f: { id?: number; horario?: string; pelicula?: { titulo?: string }; sala?: { numero?: number } }): string {
    const titulo = f.pelicula?.titulo ?? 'Sin película'
    const sala = f.sala?.numero != null ? `Sala ${f.sala.numero}` : 'Sin sala'
    const horario = f.horario ? formatDateTime(f.horario) : 'Sin horario'
    return `${titulo} — ${sala} — ${horario}`
  }

  return (
    <>
      <PageHeader
        title="Ventas"
        subtitle="CRUD con cine, pago, clientes y funciones"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nueva venta
          </Button>
        }
      />

      <ApiTestPanel label="ventas" api={ventasApi} />

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState message="No hay ventas registradas." />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(v) => v.id ?? 0}
          actions={(v) => (
            <RowCrudActions
              onView={() =>
                v.id &&
                viewById.view(`GET /api/ventas/${v.id}`, () =>
                  ventasApi.getById(v.id!),
                )
              }
              onEdit={() => openEdit(v)}
              onDelete={() => v.id && setDeleteId(v.id)}
            />
          )}
        />
      )}

      <EntityModal
        open={modalOpen}
        title={editing ? 'Editar venta (PUT)' : 'Nueva venta (POST)'}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={saveMutation.isPending}
        hasFieldErrors={Object.keys(errors).length > 0}
      >
        <FormField label="Fecha y hora" required error={errors.fecha}>
          <input
            type="datetime-local"
            className={inputClass}
            value={fecha}
            onChange={(e) => {
              setFecha(e.target.value)
              clearError('fecha')
            }}
          />
        </FormField>
        <FormField label="Cine" required error={errors.cine}>
          <select
            className={inputClass}
            value={cineId}
            onChange={(e) => {
              setCineId(e.target.value ? Number(e.target.value) : '')
              clearError('cine')
            }}
          >
            <option value="">Seleccionar</option>
            {(cinesQ.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </FormField>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField
            label="Monto del pago"
            required
            error={errors.pagoMonto}
            hint="Total a cobrar por la venta."
          >
            <input
              type="number"
              min={0}
              step={0.01}
              className={inputClass}
              value={pagoMonto === '' ? '' : pagoMonto}
              onChange={(e) => {
                setPagoMonto(e.target.value ? Number(e.target.value) : '')
                clearError('pagoMonto')
              }}
              placeholder="0"
            />
          </FormField>
          <FormField label="Método de pago" required error={errors.pagoTipo}>
            <select
              className={inputClass}
              value={pagoTipo}
              onChange={(e) => {
                setPagoTipo(e.target.value as TipoPago)
                clearError('pagoTipo')
              }}
            >
              {TIPOS_PAGO.map((t) => (
                <option key={t} value={t}>
                  {t === 'TARJETA' ? 'Tarjeta' : 'Efectivo'}
                </option>
              ))}
            </select>
          </FormField>
        </div>
        <FormField label="Cliente" required error={errors.cliente}>
          <select
            className={inputClass}
            value={clienteId}
            onChange={(e) => {
              setClienteId(e.target.value ? Number(e.target.value) : '')
              clearError('cliente')
            }}
          >
            <option value="">Seleccionar</option>
            {(clientesQ.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          label="Funciones"
          required
          error={errors.funciones}
          hint="Seleccioná al menos una función (Ctrl+clic para elegir varias)."
        >
          <MultiSelect
            options={(funcionesQ.data ?? []).map((f) => ({
              id: f.id!,
              label: funcionLabel(f),
            }))}
            value={funcionIds}
            onChange={(ids) => {
              setFuncionIds(ids)
              clearError('funciones')
            }}
          />
        </FormField>
      </EntityModal>

      <ConfirmDialog
        open={deleteId != null}
        message="¿Eliminar esta venta? (DELETE)"
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
