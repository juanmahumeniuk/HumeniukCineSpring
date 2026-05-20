const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) {
    return undefined as T
  }
  const text = await res.text()
  if (!text) {
    if (!res.ok) throw new Error(`Error ${res.status}`)
    return undefined as T
  }
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(text)
  }
  if (!res.ok) {
    const err = data as { error?: string; message?: string; status?: number }
    const msg =
      err?.error ??
      err?.message ??
      (typeof data === 'string' ? data : `Error HTTP ${res.status}`)
    throw new Error(msg)
  }
  return data as T
}

export const api = {
  get: <T>(path: string) =>
    fetch(path, { headers: JSON_HEADERS }).then((r) => handleResponse<T>(r)),

  post: <T>(path: string, body: unknown) =>
    fetch(path, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(body),
    }).then((r) => handleResponse<T>(r)),

  put: <T>(path: string, body: unknown) =>
    fetch(path, {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify(body),
    }).then((r) => handleResponse<T>(r)),

  del: (path: string) =>
    fetch(path, { method: 'DELETE', headers: JSON_HEADERS }).then((r) =>
      handleResponse<void>(r),
    ),
}

function createResource<T extends { id?: number }>(basePath: string) {
  return {
    basePath,
    getAll: () => api.get<T[]>(basePath),
    getById: (id: number) => api.get<T>(`${basePath}/${id}`),
    getPage: (page = 0, size = 10, sort?: string) => {
      const params = new URLSearchParams({
        page: String(page),
        size: String(size),
      })
      if (sort) params.set('sort', sort)
      return api.get<import('../types/api').SpringPage<T>>(
        `${basePath}/page?${params}`,
      )
    },
    create: (body: unknown) => api.post<T>(basePath, body),
    update: (id: number, body: unknown) => api.put<T>(`${basePath}/${id}`, body),
    remove: (id: number) => api.del(`${basePath}/${id}`),
  }
}

export type ResourceApi<T extends { id?: number }> = ReturnType<
  typeof createResource<T>
>

export const cinesApi = createResource<import('../types').Cine>('/api/cines')
export const peliculasApi = createResource<import('../types').Pelicula>('/api/peliculas')
export const salasApi = createResource<import('../types').Sala>('/api/salas')
export const salasVipApi = createResource<import('../types').SalaVIP>('/api/salas-vip')
const funcionesResource = createResource<import('../types').Funcion>('/api/funciones')
export const funcionesApi = {
  ...funcionesResource,
  countByPelicula: () =>
    api.get<Record<string, number>>(
      `${funcionesResource.basePath}/conteo-por-pelicula`,
    ),
}
export const entradasApi = createResource<import('../types').Entrada>('/api/entradas')
export const clientesApi = createResource<import('../types').Cliente>('/api/clientes')
export const clientesVipApi = createResource<import('../types').ClienteVIP>('/api/clientes-vip')
export const empleadosApi = createResource<import('../types').Empleado>('/api/empleados')
export const ventasApi = createResource<import('../types').Venta>('/api/ventas')
export const comprasApi = createResource<import('../types').Compra>('/api/compras')
export const pagosApi = createResource<import('../types').Pago>('/api/pagos')
export const insumosApi = createResource<import('../types').Insumo>('/api/insumos')
export const proveedoresApi = createResource<import('../types').Proveedor>('/api/proveedores')
