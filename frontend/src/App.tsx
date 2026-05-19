import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from './components/layout/AppLayout'
import { CineProvider } from './context/CineContext'
import { DashboardPage } from './pages/DashboardPage'
import { CinesPage } from './pages/CinesPage'
import { PeliculasPage } from './pages/PeliculasPage'
import { PeliculaDetailPage } from './pages/PeliculaDetailPage'
import { SalasPage } from './pages/SalasPage'
import { FuncionesPage } from './pages/FuncionesPage'
import { ClientesPage } from './pages/ClientesPage'
import { VentasPage } from './pages/VentasPage'
import { ComprasPage } from './pages/ComprasPage'
import { EmpleadosPage } from './pages/EmpleadosPage'
import { EntradasPage } from './pages/EntradasPage'
import { PagosPage } from './pages/PagosPage'
import { InsumosPage } from './pages/InsumosPage'
import { ProveedoresPage } from './pages/ProveedoresPage'
import { ApiExplorerPage } from './pages/ApiExplorerPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CineProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<PeliculasPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="cines" element={<CinesPage />} />
              <Route path="peliculas" element={<PeliculasPage />} />
              <Route path="peliculas/:id" element={<PeliculaDetailPage />} />
              <Route path="salas" element={<SalasPage />} />
              <Route path="funciones" element={<FuncionesPage />} />
              <Route path="clientes" element={<ClientesPage />} />
              <Route path="ventas" element={<VentasPage />} />
              <Route path="compras" element={<ComprasPage />} />
              <Route path="empleados" element={<EmpleadosPage />} />
              <Route path="entradas" element={<EntradasPage />} />
              <Route path="pagos" element={<PagosPage />} />
              <Route path="insumos" element={<InsumosPage />} />
              <Route path="proveedores" element={<ProveedoresPage />} />
              <Route path="api-explorer" element={<ApiExplorerPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CineProvider>
    </QueryClientProvider>
  )
}
