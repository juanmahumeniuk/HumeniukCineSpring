import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Film,
  Pencil,
  Star,
  Ticket,
  User,
} from 'lucide-react'
import { PeliculaApiActions } from '../components/peliculas/PeliculaApiActions'
import { PeliculaPageBackdrop } from '../components/peliculas/PeliculaPageBackdrop'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { EntityModal, FormField, inputClass } from '../components/ui/EntityModal'
import { GenreBadge } from '../components/ui/GenreBadge'
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton'
import { funcionesApi, peliculasApi } from '../api/client'
import { useMutationFeedback } from '../hooks/useMutationFeedback'
import { useFormErrors } from '../hooks/useFormErrors'
import {
  between,
  compose,
  integer,
  maxLength,
  minLength,
  oneOf,
  required,
} from '../lib/validation'
import { formatPuntaje, generoLabel, posterOriginalForPelicula } from '../utils'
import type { Genero, Pelicula } from '../types'

const GENEROS: Genero[] = ['ACCION', 'COMEDIA', 'DRAMA', 'SUSPENSO']

export function PeliculaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const peliculaId = Number(id)
  const navigate = useNavigate()
  const feedback = useMutationFeedback()
  const { errors, validate, clearError, reset: resetErrors } = useFormErrors()

  const validId = Number.isFinite(peliculaId) && peliculaId > 0

  const {
    data: pelicula,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['peliculas', peliculaId],
    queryFn: () => peliculasApi.getById(peliculaId),
    enabled: validId,
  })

  const { data: funciones = [] } = useQuery({
    queryKey: ['funciones'],
    queryFn: funcionesApi.getAll,
  })

  const funcionesCount = useMemo(() => {
    if (!pelicula?.id) return 0
    return funciones.filter((f) => f.pelicula?.id === pelicula.id).length
  }, [funciones, pelicula?.id])

  const [modalOpen, setModalOpen] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [genero, setGenero] = useState<Genero>('DRAMA')
  const [descripcion, setDescripcion] = useState('')
  const [puntaje, setPuntaje] = useState('')
  const [anio, setAnio] = useState('')
  const [duracionMinutos, setDuracionMinutos] = useState('')
  const [director, setDirector] = useState('')
  const [clasificacion, setClasificacion] = useState('')

  useEffect(() => {
    if (!pelicula) return
    setTitulo(pelicula.titulo)
    setGenero(pelicula.genero)
    setDescripcion(pelicula.descripcion ?? '')
    setPuntaje(pelicula.puntaje != null ? String(pelicula.puntaje) : '')
    setAnio(pelicula.anio != null ? String(pelicula.anio) : '')
    setDuracionMinutos(
      pelicula.duracionMinutos != null ? String(pelicula.duracionMinutos) : '',
    )
    setDirector(pelicula.director ?? '')
    setClasificacion(pelicula.clasificacion ?? '')
  }, [pelicula])

  function closeModal() {
    setModalOpen(false)
    resetErrors()
  }

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
      return peliculasApi.update(peliculaId, body)
    },
    onSuccess: feedback.onSaveSuccess(
      [['peliculas'], ['peliculas', peliculaId]],
      'Película',
      true,
      closeModal,
    ),
    onError: feedback.onSaveError('Película', true),
  })

  function handleSubmit() {
    const ok = validate(
      {
        titulo,
        genero,
        descripcion,
        puntaje,
        anio,
        duracionMinutos,
        director,
        clasificacion,
      },
      {
        titulo: compose(
          required('El título'),
          minLength(2, 'El título'),
          maxLength(120, 'El título'),
        ),
        genero: oneOf(GENEROS, 'El género'),
        descripcion: maxLength(2000, 'La descripción'),
        puntaje: between(0, 10, 'El puntaje'),
        anio: compose(integer('El año'), between(1888, 2100, 'El año')),
        duracionMinutos: compose(
          integer('La duración'),
          between(1, 600, 'La duración (minutos)'),
        ),
        director: maxLength(120, 'El director'),
        clasificacion: maxLength(20, 'La clasificación'),
      },
    )
    if (!ok) return
    saveMutation.mutate()
  }

  if (!validId) {
    return (
      <div className="text-center">
        <EmptyState message="ID de película inválido." />
        <Link to="/" className="mt-4 inline-block text-sm text-white/70 hover:text-white">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSkeleton rows={6} />
  }

  if (isError || !pelicula) {
    return (
      <div className="text-center">
        <EmptyState message="No se encontró la película." />
        <Link to="/" className="mt-4 inline-block text-sm text-white/70 hover:text-white">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const posterUrl = posterOriginalForPelicula(pelicula)
  return (
    <>
      <PeliculaPageBackdrop imageUrl={posterUrl} />

      <div className="relative min-h-[100dvh] pb-12 pt-2">
          <Link
            to="/"
            className="liquid-btn glass-strong mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium text-white/85 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Catálogo
          </Link>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end">
            <div className="mx-auto w-full max-w-[280px] shrink-0 sm:max-w-[320px] lg:mx-0">
              <div className="overflow-hidden rounded-2xl border border-white/15 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)]">
                <img
                  src={posterUrl}
                  alt={`Portada de ${pelicula.titulo}`}
                  className="aspect-[2/3] w-full object-cover"
                  draggable={false}
                />
              </div>
            </div>

            <div className="flex-1 pb-2">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <GenreBadge genero={pelicula.genero} />
                {pelicula.clasificacion && (
                  <span className="glass-badge text-white/90">{pelicula.clasificacion}</span>
                )}
                {funcionesCount > 0 && (
                  <span className="glass-badge text-white/90">
                    <Ticket className="h-3 w-3" />
                    {funcionesCount} {funcionesCount === 1 ? 'función' : 'funciones'}
                  </span>
                )}
              </div>

              <h1 className="heading-display text-[32px] leading-[1.05] sm:text-[48px] lg:text-[56px]">
                {pelicula.titulo}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-white/75">
                {pelicula.anio != null && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 opacity-70" />
                    {pelicula.anio}
                  </span>
                )}
                {pelicula.duracionMinutos != null && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 opacity-70" />
                    {pelicula.duracionMinutos} min
                  </span>
                )}
                {pelicula.puntaje != null && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-amber-300">
                    <Star className="h-4 w-4 fill-amber-300" />
                    {formatPuntaje(pelicula.puntaje)} IMDb
                  </span>
                )}
                {pelicula.director && (
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-4 w-4 opacity-70" />
                    {pelicula.director}
                  </span>
                )}
              </div>

              {pelicula.descripcion && (
                <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/80 sm:text-[16px]">
                  {pelicula.descripcion}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                <Button onClick={() => navigate('/funciones')}>
                  <Ticket className="h-4 w-4" />
                  Ver funciones
                </Button>
                <Button variant="outline" onClick={() => setModalOpen(true)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Button>
              </div>
            </div>
          </div>

        <div className="space-y-6 pt-10">
        {/* Metadatos */}
        <section className="glass-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-[17px] font-semibold text-white">
            <Film className="h-4 w-4 text-white/60" />
            Ficha técnica
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetaItem label="ID" value={String(pelicula.id ?? '—')} />
            <MetaItem label="Título" value={pelicula.titulo} />
            <MetaItem label="Género" value={generoLabel(pelicula.genero)} />
            <MetaItem label="Año" value={pelicula.anio != null ? String(pelicula.anio) : '—'} />
            <MetaItem
              label="Duración"
              value={
                pelicula.duracionMinutos != null
                  ? `${pelicula.duracionMinutos} minutos`
                  : '—'
              }
            />
            <MetaItem
              label="Puntaje IMDb"
              value={pelicula.puntaje != null ? formatPuntaje(pelicula.puntaje) : '—'}
            />
            <MetaItem label="Director" value={pelicula.director ?? '—'} />
            <MetaItem label="Clasificación" value={pelicula.clasificacion ?? '—'} />
            <MetaItem
              label="Funciones en cartelera"
              value={String(funcionesCount)}
              className="sm:col-span-2 lg:col-span-3"
            />
          </dl>
          {pelicula.descripcion && (
            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
                Sinopsis
              </p>
              <p className="text-[14px] leading-relaxed text-white/80">{pelicula.descripcion}</p>
            </div>
          )}
        </section>

        <PeliculaApiActions
          peliculaId={peliculaId}
          onEditRequest={() => setModalOpen(true)}
          onRefreshed={() => refetch()}
          onDeleted={() => navigate('/')}
        />
        </div>
      </div>

      <EntityModal
        open={modalOpen}
        title="Editar película"
        onClose={closeModal}
        onSubmit={handleSubmit}
        isSubmitting={saveMutation.isPending}
        hasFieldErrors={Object.keys(errors).length > 0}
      >
        <FormField label="Título" required error={errors.titulo}>
          <input
            className={inputClass}
            value={titulo}
            onChange={(e) => {
              setTitulo(e.target.value)
              clearError('titulo')
            }}
          />
        </FormField>
        <FormField label="Género" required error={errors.genero}>
          <select
            className={inputClass}
            value={genero}
            onChange={(e) => {
              setGenero(e.target.value as Genero)
              clearError('genero')
            }}
          >
            {GENEROS.map((g) => (
              <option key={g} value={g}>
                {generoLabel(g)}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Descripción" error={errors.descripcion}>
          <textarea
            className={`${inputClass} min-h-[88px] resize-y`}
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value)
              clearError('descripcion')
            }}
            rows={4}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <FormField label="Puntaje (0–10)" error={errors.puntaje}>
            <input
              className={inputClass}
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={puntaje}
              onChange={(e) => {
                setPuntaje(e.target.value)
                clearError('puntaje')
              }}
            />
          </FormField>
          <FormField label="Año" error={errors.anio}>
            <input
              className={inputClass}
              type="number"
              min={1888}
              max={2100}
              value={anio}
              onChange={(e) => {
                setAnio(e.target.value)
                clearError('anio')
              }}
            />
          </FormField>
          <FormField label="Duración (min)" error={errors.duracionMinutos}>
            <input
              className={inputClass}
              type="number"
              min={1}
              value={duracionMinutos}
              onChange={(e) => {
                setDuracionMinutos(e.target.value)
                clearError('duracionMinutos')
              }}
            />
          </FormField>
        </div>
        <FormField label="Director" error={errors.director}>
          <input
            className={inputClass}
            value={director}
            onChange={(e) => {
              setDirector(e.target.value)
              clearError('director')
            }}
          />
        </FormField>
        <FormField
          label="Clasificación"
          error={errors.clasificacion}
          hint="Ejemplos: ATP, +13, +16"
        >
          <input
            className={inputClass}
            value={clasificacion}
            onChange={(e) => {
              setClasificacion(e.target.value)
              clearError('clasificacion')
            }}
            placeholder="ATP, +13, +16…"
          />
        </FormField>
      </EntityModal>
    </>
  )
}

function MetaItem({
  label,
  value,
  className = '',
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={className}>
      <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
        {label}
      </dt>
      <dd className="mt-0.5 text-[14px] font-medium text-white">{value}</dd>
    </div>
  )
}
