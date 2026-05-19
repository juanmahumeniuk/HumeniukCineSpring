import { useState } from 'react'

export function useViewById() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [data, setData] = useState<unknown>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function view<T>(
    label: string,
    fetcher: () => Promise<T>,
  ) {
    setLoading(true)
    setError(null)
    setTitle(label)
    setOpen(true)
    try {
      const result = await fetcher()
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  function close() {
    setOpen(false)
    setData(null)
    setError(null)
  }

  return { open, title, data, error, loading, view, close }
}
