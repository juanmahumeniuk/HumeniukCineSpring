import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { MapPin, Plus } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { ApiTestPanel } from '../components/crud/ApiTestPanel'
import { JsonDetailModal } from '../components/crud/JsonDetailModal'
import { Button } from '../components/ui/Button'
import { MultiSelect } from '../components/ui/MultiSelect'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton'
import { EntityModal, FormField, inputClass } from '../components/ui/EntityModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { useViewById } from '../hooks/useViewById'
import { cinesApi, empleadosApi, peliculasApi } from '../api/client'
import { useMutationFeedback } from '../hooks/useMutationFeedback'
import { CINE_PLACEHOLDER } from '../utils'
import type { Cine } from '../types'

export function CinesPage() {
  const feedback = useMutationFeedback()
  const viewById = useViewById()
  const { data: cines = [], isLoading } = useQuery({
    queryKey: ['cines'],
    queryFn: cinesApi.getAll,
  })
  const peliculasQ = useQuery({ queryKey: ['peliculas'], queryFn: peliculasApi.getAll })
  const empleadosQ = useQuery({ queryKey: ['empleados'], queryFn: empleadosApi.getAll })

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Cine | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [peliculaIds, setPeliculaIds] = useState<number[]>([])
  const [empleadoIds, setEmpleadoIds] = useState<number[]>([])

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        nombre,
        direccion,
        peliculas: peliculaIds.map((id) => ({ id })),
        empleados: empleadoIds.map((id) => ({ id })),
      }
      if (editing?.id) return cinesApi.update(editing.id, body)
      return cinesApi.create(body)
    },
    onSuccess: feedback.onSaveSuccess(['cines'], 'Cine', !!editing, closeModal),
    onError: feedback.onSaveError('Cine', !!editing),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => cinesApi.remove(id),
    onSuccess: feedback.onDeleteSuccess(['cines'], 'Cine', () => setDeleteId(null)),
    onError: feedback.onDeleteError('Cine'),
  })

  function openCreate() {
    setEditing(null)
    setNombre('')
    setDireccion('')
    setPeliculaIds([])
    setEmpleadoIds([])
    setModalOpen(true)
  }

  function openEdit(c: Cine) {
    setEditing(c)
    setNombre(c.nombre)
    setDireccion(c.direccion)
    setPeliculaIds((c.peliculas ?? []).map((p) => p.id!).filter(Boolean))
    setEmpleadoIds((c.empleados ?? []).map((e) => e.id!).filter(Boolean))
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
  }

  return (
    <>
      <PageHeader
        title="Cines"
        subtitle="CRUD con películas y empleados asociados"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nuevo cine
          </Button>
        }
      />

      <ApiTestPanel label="cines" api={cinesApi} />

      {isLoading ? (
        <LoadingSkeleton rows={3} />
      ) : cines.length === 0 ? (
        <EmptyState message="No hay cines registrados." />
      ) : (
        <div className="space-y-4">
          {cines.map((c) => (
            <div
              key={c.id}
              className="glass-card flex flex-col gap-4 p-4 md:flex-row md:items-center"
            >
              <img
                src={CINE_PLACEHOLDER}
                alt=""
                className="h-32 w-full rounded-lg object-cover md:w-48"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{c.nombre}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-text-muted">
                  <MapPin className="h-4 w-4 text-accent" />
                  {c.direccion}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      c.id &&
                      viewById.view(`GET /api/cines/${c.id}`, () =>
                        cinesApi.getById(c.id!),
                      )
                    }
                  >
                    Ver ID
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEdit(c)}>
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => c.id && setDeleteId(c.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
              <div className="flex gap-8 text-center md:pr-8">
                <div>
                  <p className="text-xs text-text-muted">Salas</p>
                  <p className="text-2xl font-bold text-white">{c.salas?.length ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Empleados</p>
                  <p className="text-2xl font-bold text-white">{c.empleados?.length ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Películas en cartelera</p>
                  <p className="text-2xl font-bold text-white">{c.peliculas?.length ?? 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EntityModal
        open={modalOpen}
        title={editing ? 'Editar cine (PUT)' : 'Nuevo cine (POST)'}
        onClose={closeModal}
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
        <FormField label="Dirección">
          <input
            className={inputClass}
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Películas en cartelera">
          <MultiSelect
            options={(peliculasQ.data ?? []).map((p) => ({
              id: p.id!,
              label: p.titulo,
            }))}
            value={peliculaIds}
            onChange={setPeliculaIds}
          />
        </FormField>
        <FormField label="Empleados">
          <MultiSelect
            options={(empleadosQ.data ?? []).map((e) => ({
              id: e.id!,
              label: e.nombre,
            }))}
            value={empleadoIds}
            onChange={setEmpleadoIds}
          />
        </FormField>
      </EntityModal>

      <ConfirmDialog
        open={deleteId != null}
        message="¿Eliminar este cine? (DELETE)"
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
