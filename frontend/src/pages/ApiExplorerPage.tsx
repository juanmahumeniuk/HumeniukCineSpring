import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import {
  cinesApi,
  peliculasApi,
  salasApi,
  salasVipApi,
  funcionesApi,
  entradasApi,
  clientesApi,
  clientesVipApi,
  empleadosApi,
  ventasApi,
  comprasApi,
  pagosApi,
  insumosApi,
  proveedoresApi,
} from '../api/client'
import type { ResourceApi } from '../api/client'

type ResourceKey =
  | 'cines'
  | 'peliculas'
  | 'salas'
  | 'salas-vip'
  | 'funciones'
  | 'entradas'
  | 'clientes'
  | 'clientes-vip'
  | 'empleados'
  | 'ventas'
  | 'compras'
  | 'pagos'
  | 'insumos'
  | 'proveedores'

const RESOURCES: {
  key: ResourceKey
  label: string
  api: ResourceApi<{ id?: number }>
  queryKey: string
}[] = [
  { key: 'cines', label: 'Cines', api: cinesApi, queryKey: 'cines' },
  { key: 'peliculas', label: 'Películas', api: peliculasApi, queryKey: 'peliculas' },
  { key: 'salas', label: 'Salas', api: salasApi, queryKey: 'salas' },
  { key: 'salas-vip', label: 'Salas VIP', api: salasVipApi, queryKey: 'salas-vip' },
  { key: 'funciones', label: 'Funciones', api: funcionesApi, queryKey: 'funciones' },
  { key: 'entradas', label: 'Entradas', api: entradasApi, queryKey: 'entradas' },
  { key: 'clientes', label: 'Clientes', api: clientesApi, queryKey: 'clientes' },
  { key: 'clientes-vip', label: 'Clientes VIP', api: clientesVipApi, queryKey: 'clientes-vip' },
  { key: 'empleados', label: 'Empleados', api: empleadosApi, queryKey: 'empleados' },
  { key: 'ventas', label: 'Ventas', api: ventasApi, queryKey: 'ventas' },
  { key: 'compras', label: 'Compras', api: comprasApi, queryKey: 'compras' },
  { key: 'pagos', label: 'Pagos', api: pagosApi, queryKey: 'pagos' },
  { key: 'insumos', label: 'Insumos', api: insumosApi, queryKey: 'insumos' },
  { key: 'proveedores', label: 'Proveedores', api: proveedoresApi, queryKey: 'proveedores' },
]

function ResourceTab({
  resource,
}: {
  resource: (typeof RESOURCES)[number]
}) {
  const qc = useQueryClient()
  const viewById = useViewById()
  const { data = [], isLoading, refetch } = useQuery({
    queryKey: [resource.queryKey],
    queryFn: resource.api.getAll,
  })

  const [jsonBody, setJsonBody] = useState('{}')
  const [editId, setEditId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = JSON.parse(jsonBody)
      if (editId) return resource.api.update(editId, body)
      return resource.api.create(body)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [resource.queryKey] })
      setModalOpen(false)
      setEditId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => resource.api.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [resource.queryKey] })
      setDeleteId(null)
    },
  })

  const columns: Column<{ id?: number }>[] = [
    {
      key: 'row',
      header: 'Registro (JSON resumido)',
      render: (row) => (
        <code className="block max-w-md truncate text-xs text-text-muted">
          {JSON.stringify(row)}
        </code>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => refetch()}>
          GET {resource.api.basePath}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditId(null)
            setJsonBody(getExampleBody(resource.key))
            setModalOpen(true)
          }}
        >
          POST {resource.api.basePath}
        </Button>
      </div>

      <ApiTestPanel label={resource.key} api={resource.api} />

      {isLoading ? (
        <LoadingSkeleton rows={3} />
      ) : data.length === 0 ? (
        <EmptyState message={`Sin datos en ${resource.api.basePath}`} />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          keyExtractor={(r) => r.id ?? JSON.stringify(r)}
          actions={(r) => (
            <RowCrudActions
              onView={() =>
                r.id &&
                viewById.view(`GET ${resource.api.basePath}/${r.id}`, () =>
                  resource.api.getById(r.id!),
                )
              }
              onEdit={() => {
                setEditId(r.id ?? null)
                setJsonBody(JSON.stringify(r, null, 2))
                setModalOpen(true)
              }}
              onDelete={() => r.id && setDeleteId(r.id)}
            />
          )}
        />
      )}

      <EntityModal
        open={modalOpen}
        title={
          editId
            ? `PUT ${resource.api.basePath}/${editId}`
            : `POST ${resource.api.basePath}`
        }
        onClose={() => {
          setModalOpen(false)
          setEditId(null)
        }}
        onSubmit={() => saveMutation.mutate()}
        isSubmitting={saveMutation.isPending}
        submitLabel={editId ? 'PUT' : 'POST'}
      >
        <FormField label="Body JSON">
          <textarea
            className={`${inputClass} min-h-[200px] font-mono text-xs`}
            value={jsonBody}
            onChange={(e) => setJsonBody(e.target.value)}
          />
        </FormField>
        {saveMutation.isError && (
          <p className="text-sm text-danger">
            {saveMutation.error instanceof Error
              ? saveMutation.error.message
              : 'Error al guardar'}
          </p>
        )}
      </EntityModal>

      <ConfirmDialog
        open={deleteId != null}
        message={`DELETE ${resource.api.basePath}/${deleteId}?`}
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
    </div>
  )
}

function getExampleBody(key: ResourceKey): string {
  const examples: Record<ResourceKey, object> = {
    cines: { nombre: 'Cine Test', direccion: 'Calle 1' },
    peliculas: {
      titulo: 'Película Test',
      genero: 'DRAMA',
      descripcion: 'Sinopsis de prueba para el explorador de API.',
      puntaje: 7.5,
      anio: 2024,
      duracionMinutos: 110,
      director: 'Director Ejemplo',
      clasificacion: '+13',
    },
    salas: { numero: 1, capacidad: 100, cine: { id: 1 } },
    'salas-vip': { numero: 2, capacidad: 50, beneficios: 'Catering', cine: { id: 1 } },
    funciones: { horario: '20:00', pelicula: { id: 1 }, sala: { id: 1 } },
    entradas: { precio: 1500, asiento: 'A1', funcion: { id: 1 } },
    clientes: { nombre: 'Cliente Test', email: 'test@test.com' },
    'clientes-vip': { nombre: 'VIP Test', email: 'vip@test.com', descuento: 10 },
    empleados: { nombre: 'Empleado Test', dni: 12345678 },
    ventas: {
      fecha: new Date().toISOString(),
      cine: { id: 1 },
      pago: { id: 1 },
      clientes: [{ id: 1 }],
      funciones: [{ id: 1 }],
    },
    compras: {
      fecha: new Date().toISOString(),
      cine: { id: 1 },
      insumos: [{ id: 1 }],
      proveedores: [{ id: 1 }],
    },
    pagos: { monto: 1500, tipo: 'EFECTIVO' },
    insumos: { nombre: 'Pochoclo', precio: 500 },
    proveedores: { nombre: 'Proveedor', telefono: '111', direccion: 'Calle 2' },
  }
  return JSON.stringify(examples[key], null, 2)
}

export function ApiExplorerPage() {
  const [active, setActive] = useState<ResourceKey>('cines')
  const current = RESOURCES.find((r) => r.key === active)!

  return (
    <>
      <PageHeader
        title="Explorador API"
        subtitle="Probá los 14 endpoints: GET, GET /page, GET /id, POST, PUT, DELETE"
      />

      <div className="glass-subtle mb-6 flex flex-wrap gap-1 rounded-2xl p-1.5">
        {RESOURCES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setActive(r.key)}
            className={`nav-pill rounded-full px-3 py-1.5 text-[12px] font-medium tracking-tight transition-colors ${
              active === r.key ? 'is-active' : 'text-text-muted hover:text-white'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <ResourceTab resource={current} />
    </>
  )
}
