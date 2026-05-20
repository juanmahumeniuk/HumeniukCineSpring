import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useToast } from '../context/ToastContext'
import { refreshListQueries } from '../lib/queryRefresh'

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) return error.message
  return fallback
}

/** Acepta una clave o varias: `['peliculas']` o `[['peliculas'], ['peliculas', id]]`. */
function normalizeQueryKeys(keys: QueryKey | QueryKey[]): QueryKey[] {
  if (keys.length === 0) return []
  const first = keys[0]
  if (Array.isArray(first)) return keys as QueryKey[]
  return [keys as QueryKey]
}

export function useMutationFeedback() {
  const qc = useQueryClient()
  const toast = useToast()

  function onSaveSuccess(
    keys: QueryKey | QueryKey[],
    entityName: string,
    isEdit: boolean,
    then?: () => void,
  ) {
    const queryKeys = normalizeQueryKeys(keys)
    return async () => {
      try {
        await refreshListQueries(qc, ...queryKeys)
        toast.success(
          isEdit
            ? `${entityName} actualizado correctamente`
            : `${entityName} creado correctamente`,
        )
        then?.()
      } catch {
        toast.error(
          `Se guardó ${entityName.toLowerCase()}, pero no se pudo actualizar la lista`,
        )
        then?.()
      }
    }
  }

  function onSaveError(entityName: string, isEdit: boolean) {
    return (error: unknown) => {
      toast.error(
        errorMessage(
          error,
          isEdit
            ? `No se pudo actualizar ${entityName.toLowerCase()}`
            : `No se pudo crear ${entityName.toLowerCase()}`,
        ),
      )
    }
  }

  function onDeleteSuccess(
    keys: QueryKey | QueryKey[],
    entityName: string,
    then?: () => void,
  ) {
    const queryKeys = normalizeQueryKeys(keys)
    return async () => {
      try {
        await refreshListQueries(qc, ...queryKeys)
        toast.success(`${entityName} eliminado correctamente`)
        then?.()
      } catch {
        toast.error(
          `Se eliminó ${entityName.toLowerCase()}, pero no se pudo actualizar la lista`,
        )
        then?.()
      }
    }
  }

  function onDeleteError(entityName: string) {
    return (error: unknown) => {
      toast.error(
        errorMessage(
          error,
          `No se pudo eliminar ${entityName.toLowerCase()}`,
        ),
      )
    }
  }

  return { onSaveSuccess, onSaveError, onDeleteSuccess, onDeleteError }
}
