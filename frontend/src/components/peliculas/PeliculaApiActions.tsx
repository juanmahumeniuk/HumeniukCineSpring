import { useState } from 'react'
import { RefreshCw, Terminal, Trash2 } from 'lucide-react'
import { peliculasApi } from '../../api/client'
import { Button } from '../ui/Button'
import { inputClass } from '../ui/EntityModal'
import { JsonDetailModal } from '../crud/JsonDetailModal'

interface PeliculaApiActionsProps {
  peliculaId: number
  onDeleted?: () => void
  onEditRequest?: () => void
  onRefreshed?: () => void
}

export function PeliculaApiActions({
  peliculaId,
  onDeleted,
  onEditRequest,
  onRefreshed,
}: PeliculaApiActionsProps) {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailTitle, setDetailTitle] = useState('')
  const [detailData, setDetailData] = useState<unknown>(null)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function run(
    title: string,
    fn: () => Promise<unknown>,
    afterSuccess?: () => void,
  ) {
    setLoading(true)
    setDetailError(null)
    setDetailTitle(title)
    setDetailOpen(true)
    try {
      const result = await fn()
      setDetailData(result ?? { ok: true })
      afterSuccess?.()
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : 'Error')
      setDetailData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="glass-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-info/15 ring-1 ring-info/25">
            <Terminal className="h-3.5 w-3.5 text-info" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            API — películas
          </p>
          <span className="glass-badge text-white/80">ID {peliculaId}</span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                run(
                  `GET /api/peliculas/${peliculaId}`,
                  () => peliculasApi.getById(peliculaId),
                  onRefreshed,
                )
              }
            >
              <RefreshCw className="h-3.5 w-3.5" />
              GET por ID
            </Button>
            <Button variant="outline" size="sm" onClick={onEditRequest}>
              PUT actualizar
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() =>
                run(
                  `DELETE /api/peliculas/${peliculaId}`,
                  async () => {
                    await peliculasApi.remove(peliculaId)
                    return { deleted: peliculaId }
                  },
                  onDeleted,
                )
              }
            >
              <Trash2 className="h-3.5 w-3.5" />
              DELETE
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                run('GET /api/peliculas', () => peliculasApi.getAll())
              }
            >
              GET todas
            </Button>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
              GET /page
            </label>
            <div className="flex flex-wrap gap-2">
              <input
                type="number"
                min={0}
                className={`${inputClass} w-20 text-center tabular-nums`}
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
              />
              <input
                type="number"
                min={1}
                className={`${inputClass} w-20 text-center tabular-nums`}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  run(
                    `GET /api/peliculas/page?page=${page}&size=${size}`,
                    () => peliculasApi.getPage(page, size),
                  )
                }
              >
                Probar paginación
              </Button>
            </div>
          </div>
        </div>
      </div>

      <JsonDetailModal
        open={detailOpen}
        title={detailTitle}
        data={detailData}
        error={detailError}
        loading={loading}
        onClose={() => setDetailOpen(false)}
      />
    </>
  )
}
