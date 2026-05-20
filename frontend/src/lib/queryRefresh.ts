import type { QueryClient, QueryKey } from '@tanstack/react-query'

/** Vuelve a ejecutar GET de las listas activas tras crear, editar o eliminar. */
export async function refreshListQueries(
  qc: QueryClient,
  ...queryKeys: QueryKey[]
): Promise<void> {
  await Promise.all(
    queryKeys.map((queryKey) =>
      qc.refetchQueries({ queryKey, type: 'active' }),
    ),
  )
}
