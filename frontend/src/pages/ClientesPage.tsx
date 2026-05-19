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
import { clientesApi, clientesVipApi } from '../api/client'
import type { Cliente, ClienteVIP } from '../types'

type Tab = 'regular' | 'vip'

export function ClientesPage() {
  const qc = useQueryClient()
  const viewById = useViewById()
  const [tab, setTab] = useState<Tab>('regular')
  const clientesQ = useQuery({ queryKey: ['clientes'], queryFn: clientesApi.getAll })
  const vipQ = useQuery({ queryKey: ['clientes-vip'], queryFn: clientesVipApi.getAll })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Cliente | ClienteVIP | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [descuento, setDescuento] = useState(10)

  const isVip = tab === 'vip'
  const data = isVip ? (vipQ.data ?? []) : (clientesQ.data ?? [])
  const isLoading = isVip ? vipQ.isLoading : clientesQ.isLoading

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isVip) {
        const body = { nombre, email, descuento }
        if (editing?.id) return clientesVipApi.update(editing.id, body)
        return clientesVipApi.create(body)
      }
      const body = { nombre, email }
      if (editing?.id) return clientesApi.update(editing.id, body)
      return clientesApi.create(body)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clientes'] })
      qc.invalidateQueries({ queryKey: ['clientes-vip'] })
      setModalOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      isVip ? clientesVipApi.remove(id) : clientesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clientes'] })
      qc.invalidateQueries({ queryKey: ['clientes-vip'] })
      setDeleteId(null)
    },
  })

  const columns: Column<Cliente | ClienteVIP>[] = [
    { key: 'nombre', header: 'Nombre', render: (c) => c.nombre },
    { key: 'email', header: 'Email', render: (c) => c.email },
    ...(isVip
      ? [
          {
            key: 'desc',
            header: 'Descuento %',
            render: (c: Cliente | ClienteVIP) =>
              `${'descuento' in c ? (c as ClienteVIP).descuento : 0}%`,
          },
        ]
      : []),
  ]

  return (
    <>
      <PageHeader
        title="Clientes"
        subtitle="Gestión de clientes y clientes VIP"
        action={
          <Button
            onClick={() => {
              setEditing(null)
              setNombre('')
              setEmail('')
              setDescuento(10)
              setModalOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            {isVip ? 'Nuevo cliente VIP' : 'Nuevo cliente'}
          </Button>
        }
      />

      <div className="glass-subtle mb-6 inline-flex gap-1 rounded-full p-1">
        <button
          type="button"
          onClick={() => setTab('regular')}
          className={`nav-pill rounded-full px-4 py-1.5 text-[13px] font-medium tracking-tight transition-colors ${
            tab === 'regular' ? 'is-active' : 'text-text-muted hover:text-white'
          }`}
        >
          Clientes
        </button>
        <button
          type="button"
          onClick={() => setTab('vip')}
          className={`nav-pill rounded-full px-4 py-1.5 text-[13px] font-medium tracking-tight transition-colors ${
            tab === 'vip' ? 'is-active' : 'text-text-muted hover:text-white'
          }`}
        >
          Clientes VIP
        </button>
      </div>

      <ApiTestPanel
        label={isVip ? 'clientes-vip' : 'clientes'}
        api={isVip ? clientesVipApi : clientesApi}
      />

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : data.length === 0 ? (
        <EmptyState message="No hay clientes registrados." />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          keyExtractor={(c) => c.id ?? 0}
          actions={(c) => (
            <RowCrudActions
              onView={() =>
                c.id &&
                viewById.view(
                  `GET /api/${isVip ? 'clientes-vip' : 'clientes'}/${c.id}`,
                  () =>
                    isVip
                      ? clientesVipApi.getById(c.id!)
                      : clientesApi.getById(c.id!),
                )
              }
              onEdit={() => {
                setEditing(c)
                setNombre(c.nombre)
                setEmail(c.email)
                if ('descuento' in c) setDescuento((c as ClienteVIP).descuento)
                setModalOpen(true)
              }}
              onDelete={() => c.id && setDeleteId(c.id)}
            />
          )}
        />
      )}

      <EntityModal
        open={modalOpen}
        title={editing ? 'Editar cliente' : 'Nuevo cliente'}
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
        <FormField label="Email">
          <input
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormField>
        {isVip && (
          <FormField label="Descuento (%)">
            <input
              type="number"
              className={inputClass}
              value={descuento}
              onChange={(e) => setDescuento(Number(e.target.value))}
            />
          </FormField>
        )}
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
        message="¿Eliminar este cliente? (DELETE)"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
