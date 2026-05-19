import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, Sparkles } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton'
import { EntityModal, FormField, inputClass } from '../components/ui/EntityModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { ApiTestPanel } from '../components/crud/ApiTestPanel'
import { JsonDetailModal } from '../components/crud/JsonDetailModal'
import { MoviesHero } from '../components/peliculas/MoviesHero'
import { MoviePosterCard } from '../components/peliculas/MoviePosterCard'
import { MovieRail } from '../components/peliculas/MovieRail'
import { useViewById } from '../hooks/useViewById'
import { funcionesApi, peliculasApi } from '../api/client'
import { generoLabel } from '../utils'
import type { Genero, Pelicula } from '../types'

const GENEROS: Genero[] = ['ACCION', 'COMEDIA', 'DRAMA', 'SUSPENSO']

type FilterKey = 'all' | 'trending' | Genero

const FILTER_LABELS: Record<FilterKey, string> = {
  all: 'Todas',
  trending: 'Destacadas',
  ACCION: 'Acción',
  COMEDIA: 'Comedia',
  DRAMA: 'Drama',
  SUSPENSO: 'Suspenso',
}

const FILTERS: FilterKey[] = ['all', 'trending', ...GENEROS]

export function PeliculasPage() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const viewById = useViewById()

  const { data: peliculas = [], isLoading } = useQuery({
    queryKey: ['peliculas'],
    queryFn: peliculasApi.getAll,
  })
  const { data: funciones = [] } = useQuery({
    queryKey: ['funciones'],
    queryFn: funcionesApi.getAll,
  })

  const funcionesPorPelicula = useMemo(() => {
    const map = new Map<number, number>()
    for (const f of funciones) {
      const pid = f.pelicula?.id
      if (pid) map.set(pid, (map.get(pid) ?? 0) + 1)
    }
    return map
  }, [funciones])

  const peliculasByGenero = useMemo(() => {
    const grouped = new Map<Genero, Pelicula[]>()
    for (const g of GENEROS) grouped.set(g, [])
    for (const p of peliculas) {
      const list = grouped.get(p.genero)
      if (list) list.push(p)
    }
    return grouped
  }, [peliculas])

  const trending = useMemo(() => {
    return [...peliculas]
      .sort(
        (a, b) =>
          (funcionesPorPelicula.get(b.id ?? 0) ?? 0) -
          (funcionesPorPelicula.get(a.id ?? 0) ?? 0),
      )
      .slice(0, 8)
  }, [peliculas, funcionesPorPelicula])

  const heroPeliculas = useMemo(() => {
    const candidatos = trending.length >= 3 ? trending : peliculas
    return candidatos.slice(0, Math.min(5, candidatos.length))
  }, [trending, peliculas])

  const [filter, setFilter] = useState<FilterKey>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Pelicula | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [titulo, setTitulo] = useState('')
  const [genero, setGenero] = useState<Genero>('DRAMA')
  const [descripcion, setDescripcion] = useState('')
  const [puntaje, setPuntaje] = useState('')
  const [anio, setAnio] = useState('')
  const [duracionMinutos, setDuracionMinutos] = useState('')
  const [director, setDirector] = useState('')
  const [clasificacion, setClasificacion] = useState('')
  const [showApiPanel, setShowApiPanel] = useState(false)

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body: Pelicula = {
        titulo,
        genero,
        descripcion: descripcion.trim() || undefined,
        puntaje: puntaje ? Number(puntaje) : undefined,
        anio: anio ? Number(anio) : undefined,
        duracionMinutos: duracionMinutos ? Number(duracionMinutos) : undefined,
        director: director.trim() || undefined,
        clasificacion: clasificacion.trim() || undefined,
      }
      if (editing?.id) return peliculasApi.update(editing.id, body)
      return peliculasApi.create(body)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['peliculas'] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => peliculasApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['peliculas'] })
      setDeleteId(null)
    },
  })

  function resetForm() {
    setTitulo('')
    setGenero('DRAMA')
    setDescripcion('')
    setPuntaje('')
    setAnio('')
    setDuracionMinutos('')
    setDirector('')
    setClasificacion('')
  }

  function openCreate() {
    setEditing(null)
    resetForm()
    setModalOpen(true)
  }

  function openEdit(p: Pelicula) {
    setEditing(p)
    setTitulo(p.titulo)
    setGenero(p.genero)
    setDescripcion(p.descripcion ?? '')
    setPuntaje(p.puntaje != null ? String(p.puntaje) : '')
    setAnio(p.anio != null ? String(p.anio) : '')
    setDuracionMinutos(p.duracionMinutos != null ? String(p.duracionMinutos) : '')
    setDirector(p.director ?? '')
    setClasificacion(p.clasificacion ?? '')
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
  }

  function openPelicula(p: Pelicula) {
    if (p.id) navigate(`/peliculas/${p.id}`)
  }

  function viewJson(p: Pelicula) {
    if (!p.id) return
    viewById.view(`GET /api/peliculas/${p.id}`, () => peliculasApi.getById(p.id!))
  }

  const showHero = !isLoading && heroPeliculas.length > 0

  const renderCard = (p: Pelicula) => (
    <MoviePosterCard
      key={p.id ?? p.titulo}
      pelicula={p}
      funcionesCount={funcionesPorPelicula.get(p.id ?? 0) ?? 0}
      onOpen={() => openPelicula(p)}
      onView={() => viewJson(p)}
      onEdit={() => openEdit(p)}
      onDelete={() => p.id && setDeleteId(p.id)}
    />
  )

  return (
    <>
      <PageHeader
        title="Películas"
        subtitle="Cartelera y catálogo en cines"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowApiPanel((v) => !v)}
            >
              {showApiPanel ? 'Ocultar API' : 'Probar API'}
            </Button>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Nueva película
            </Button>
          </div>
        }
      />

      {showApiPanel && <ApiTestPanel label="peliculas" api={peliculasApi} />}

      {isLoading ? (
        <LoadingSkeleton rows={4} />
      ) : peliculas.length === 0 ? (
        <EmptyState message="No hay películas en cartelera. Creá la primera para empezar." />
      ) : (
        <>
          {showHero && (
            <MoviesHero
              peliculas={heroPeliculas}
              funcionesPorPelicula={funcionesPorPelicula}
              onOpen={openPelicula}
              onPlay={() => navigate('/funciones')}
              onEdit={openEdit}
            />
          )}

          <div className="glass-subtle mb-8 inline-flex max-w-full flex-wrap gap-1 overflow-hidden rounded-full p-1">
            {FILTERS.map((key) => {
              const active = filter === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`nav-pill rounded-full px-4 py-1.5 text-[13px] font-medium tracking-tight transition-colors ${
                    active ? 'is-active' : 'text-text-muted hover:text-white'
                  }`}
                >
                  {key === 'trending' && (
                    <Sparkles className="mr-1 inline-block h-3.5 w-3.5" />
                  )}
                  {FILTER_LABELS[key]}
                </button>
              )
            })}
          </div>

          {filter === 'all' && (
            <>
              {trending.length > 0 && (
                <MovieRail title="Destacadas" count={trending.length}>
                  {trending.map(renderCard)}
                </MovieRail>
              )}
              {GENEROS.map((g) => {
                const list = peliculasByGenero.get(g) ?? []
                if (list.length === 0) return null
                return (
                  <MovieRail
                    key={g}
                    title={generoLabel(g)}
                    count={list.length}
                  >
                    {list.map(renderCard)}
                  </MovieRail>
                )
              })}
            </>
          )}

          {filter === 'trending' && (
            <MovieRail title="Destacadas en este momento" count={trending.length}>
              {trending.map(renderCard)}
            </MovieRail>
          )}

          {GENEROS.includes(filter as Genero) && (
            <MovieRail
              title={generoLabel(filter as Genero)}
              count={(peliculasByGenero.get(filter as Genero) ?? []).length}
            >
              {(peliculasByGenero.get(filter as Genero) ?? []).map(renderCard)}
            </MovieRail>
          )}
        </>
      )}

      <EntityModal
        open={modalOpen}
        title={editing ? 'Editar película' : 'Nueva película'}
        onClose={closeModal}
        onSubmit={() => saveMutation.mutate()}
        isSubmitting={saveMutation.isPending}
      >
        <FormField label="Título">
          <input
            className={inputClass}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Género">
          <select
            className={inputClass}
            value={genero}
            onChange={(e) => setGenero(e.target.value as Genero)}
          >
            {GENEROS.map((g) => (
              <option key={g} value={g}>
                {generoLabel(g)}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Descripción">
          <textarea
            className={`${inputClass} min-h-[88px] resize-y`}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <FormField label="Puntaje (0–10)">
            <input
              className={inputClass}
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={puntaje}
              onChange={(e) => setPuntaje(e.target.value)}
            />
          </FormField>
          <FormField label="Año">
            <input
              className={inputClass}
              type="number"
              min={1888}
              max={2100}
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
            />
          </FormField>
          <FormField label="Duración (min)">
            <input
              className={inputClass}
              type="number"
              min={1}
              value={duracionMinutos}
              onChange={(e) => setDuracionMinutos(e.target.value)}
            />
          </FormField>
        </div>
        <FormField label="Director">
          <input
            className={inputClass}
            value={director}
            onChange={(e) => setDirector(e.target.value)}
          />
        </FormField>
        <FormField label="Clasificación">
          <input
            className={inputClass}
            value={clasificacion}
            onChange={(e) => setClasificacion(e.target.value)}
            placeholder="ATP, +13, +16…"
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
        message="¿Eliminar esta película? (DELETE)"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
