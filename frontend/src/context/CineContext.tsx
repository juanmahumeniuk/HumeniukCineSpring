import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useQuery } from '@tanstack/react-query'
import { cinesApi } from '../api/client'
import type { Cine } from '../types'

interface CineContextValue {
  cines: Cine[]
  selectedCine: Cine | null
  setSelectedCineId: (id: number | null) => void
  isLoading: boolean
}

const CineContext = createContext<CineContextValue | null>(null)

export function CineProvider({ children }: { children: ReactNode }) {
  const [selectedCineId, setSelectedCineId] = useState<number | null>(null)
  const { data: cines = [], isLoading } = useQuery({
    queryKey: ['cines'],
    queryFn: cinesApi.getAll,
  })

  const selectedCine = useMemo(
    () => cines.find((c) => c.id === selectedCineId) ?? cines[0] ?? null,
    [cines, selectedCineId],
  )

  const value = useMemo(
    () => ({
      cines,
      selectedCine,
      setSelectedCineId,
      isLoading,
    }),
    [cines, selectedCine, isLoading],
  )

  return <CineContext.Provider value={value}>{children}</CineContext.Provider>
}

export function useCineContext() {
  const ctx = useContext(CineContext)
  if (!ctx) throw new Error('useCineContext must be used within CineProvider')
  return ctx
}
