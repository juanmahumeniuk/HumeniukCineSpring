export type Genero = 'ACCION' | 'COMEDIA' | 'DRAMA' | 'SUSPENSO'
export type TipoPago = 'TARJETA' | 'EFECTIVO'

export interface BaseEntity {
  id?: number
}

export interface Cine extends BaseEntity {
  nombre: string
  direccion: string
  peliculas?: Pelicula[]
  salas?: Sala[]
  empleados?: Empleado[]
}

export interface Pelicula extends BaseEntity {
  titulo: string
  genero: Genero
  descripcion?: string
  puntaje?: number
  anio?: number
  duracionMinutos?: number
  director?: string
  clasificacion?: string
}

export interface Sala extends BaseEntity {
  numero: number
  capacidad: number
  cine?: Cine
}

export interface SalaVIP extends Sala {
  beneficios: string
}

export interface Funcion extends BaseEntity {
  horario: string
  pelicula?: Pelicula
  sala?: Sala
  entradas?: Entrada[]
}

export interface Entrada extends BaseEntity {
  precio: number
  asiento: string
  funcion?: Funcion
}

export interface Cliente extends BaseEntity {
  nombre: string
  email: string
}

export interface ClienteVIP extends Cliente {
  descuento: number
}

export interface Empleado extends BaseEntity {
  nombre: string
  dni: number
  cines?: Cine[]
}

export interface Pago extends BaseEntity {
  monto: number
  tipo: TipoPago
}

export interface Venta extends BaseEntity {
  fecha: string
  cine?: Cine
  pago?: Pago
  funciones?: Funcion[]
  clientes?: Cliente[]
}

export interface Insumo extends BaseEntity {
  nombre: string
  precio: number
}

export interface Proveedor extends BaseEntity {
  nombre: string
  telefono: string
  direccion: string
}

export interface Compra extends BaseEntity {
  fecha: string
  cine?: Cine
  insumos?: Insumo[]
  proveedores?: Proveedor[]
}

export type SalaMerged = Sala & { isVip: boolean; beneficios?: string }
