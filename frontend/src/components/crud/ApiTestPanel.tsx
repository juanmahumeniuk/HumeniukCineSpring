import { useState } from 'react'
import { Terminal } from 'lucide-react'
import type { ResourceApi } from '../../api/client'
import { Button } from '../ui/Button'
import { inputClass } from '../ui/EntityModal'
import { JsonDetailModal } from './JsonDetailModal'

interface ApiTestPanelProps {
  label: string
  api: ResourceApi<{ id?: number }>
}

export function ApiTestPanel({ label, api }: ApiTestPanelProps) {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [lookupId, setLookupId] = useState('')
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailTitle, setDetailTitle] = useState('')
  const [detailData, setDetailData] = useState<unknown>(null)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function runPage() {
    setLoading(true)
    setDetailError(null)
    setDetailTitle(`GET ${api.basePath}/page`)
    setDetailOpen(true)
    try {
      const result = await api.getPage(page, size)
      setDetailData(result)
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : 'Error')
      setDetailData(null)
    } finally {
      setLoading(false)
    }
  }

  async function runGetById() {
    const id = Number(lookupId)
    if (!id) return
    setLoading(true)
    setDetailError(null)
    setDetailTitle(`GET ${api.basePath}/${id}`)
    setDetailOpen(true)
    try {
      const result = await api.getById(id)
      setDetailData(result)
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : 'Error')
      setDetailData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="glass-card mb-6 p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-info/15 ring-1 ring-info/25">
            <Terminal className="h-3.5 w-3.5 text-info" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Probar endpoints
          </p>
          <span className="glass-badge text-white/80">{label}</span>
        </div>
        <div className="flex flex-wrap items-end gap-5">
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
              GET /page
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                className={`${inputClass} w-20 text-center tabular-nums`}
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                placeholder="page"
              />
              <input
                type="number"
                min={1}
                className={`${inputClass} w-20 text-center tabular-nums`}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                placeholder="size"
              />
              <Button variant="outline" size="sm" onClick={runPage}>
                Probar paginación
              </Button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
              GET /{'{id}'}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                className={`${inputClass} w-24 text-center tabular-nums`}
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="ID"
              />
              <Button variant="outline" size="sm" onClick={runGetById}>
                Buscar por ID
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
