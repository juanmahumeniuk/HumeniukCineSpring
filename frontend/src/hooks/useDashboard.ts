import { useQuery } from '@tanstack/react-query'
import {
  comprasApi,
  entradasApi,
  funcionesApi,
  peliculasApi,
  salasApi,
  salasVipApi,
  ventasApi,
} from '../api/client'
import { isToday } from '../utils'
import { joinFuncionesWithRefs } from '../utils/funciones'
import type { Funcion, Venta } from '../types'

export function useDashboardData() {
  const ventas = useQuery({ queryKey: ['ventas'], queryFn: ventasApi.getAll })
  const entradas = useQuery({ queryKey: ['entradas'], queryFn: entradasApi.getAll })
  const funciones = useQuery({ queryKey: ['funciones'], queryFn: funcionesApi.getAll })
  const compras = useQuery({ queryKey: ['compras'], queryFn: comprasApi.getAll })
  const peliculas = useQuery({ queryKey: ['peliculas'], queryFn: peliculasApi.getAll })
  const salas = useQuery({ queryKey: ['salas'], queryFn: salasApi.getAll })
  const salasVip = useQuery({ queryKey: ['salas-vip'], queryFn: salasVipApi.getAll })

  const isLoading =
    ventas.isLoading ||
    entradas.isLoading ||
    funciones.isLoading ||
    compras.isLoading

  const ventasHoy = (ventas.data ?? []).filter((v) => v.fecha && isToday(v.fecha))
  const ventasTotalHoy = ventasHoy.reduce((s, v) => s + (v.pago?.monto ?? 0), 0)

  const allSalas = [...(salas.data ?? []), ...(salasVip.data ?? [])]
  const funcionesEnriched = joinFuncionesWithRefs(
    funciones.data ?? [],
    peliculas.data ?? [],
    allSalas,
    entradas.data ?? [],
  )

  const funcionesHoy = funcionesEnriched.filter(() => true)

  const comprasRecientes = (compras.data ?? []).slice(0, 10)
  const comprasTotal = comprasRecientes.reduce(
    (s, c) => s + (c.insumos ?? []).reduce((si, i) => si + (i.precio ?? 0), 0),
    0,
  )

  const ultimasVentas = [...(ventas.data ?? [])]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 6)

  const proximasFunciones = funcionesEnriched.slice(0, 5)

  return {
    isLoading,
    stats: {
      ventasHoy: ventasTotalHoy,
      transaccionesHoy: ventasHoy.length,
      entradasVendidas: (entradas.data ?? []).length,
      funcionesHoy: funcionesHoy.length,
      peliculasDistintas: new Set(
        funcionesEnriched.map((f) => f.pelicula?.id).filter(Boolean),
      ).size,
      comprasRecientes: comprasRecientes.length,
      comprasTotal,
    },
    ultimasVentas,
    proximasFunciones,
    funcionesEnriched,
  }
}

export function getFuncionOcupacion(f: Funcion, salas: { id?: number; capacidad: number }[]) {
  const salaId = f.sala?.id
  const sala = salas.find((s) => s.id === salaId)
  const cap = sala?.capacidad ?? f.sala?.capacidad ?? 100
  const count = f.entradas?.length ?? 0
  return { count, cap, pct: cap ? Math.min(100, Math.round((count / cap) * 100)) : 0 }
}

export function getVentaClienteNombre(v: Venta): string {
  return v.clientes?.[0]?.nombre ?? 'Cliente'
}
