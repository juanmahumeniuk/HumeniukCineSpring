# Humeniuk Cine — Panel de Administración (Frontend)

SPA React + Vite + TypeScript con estética dark/gold del mockup de administración.

## Requisitos

- Node.js 18+
- Backend Spring Boot en ejecución (`./gradlew bootRun`, puerto **9000**)
- MySQL con la base `db_cine` configurada

**Sin instalar Node ni Java:** desde la raíz del repo, `cp .env.example .env && docker compose up --build` y abrir http://localhost:8080 (nginx sirve el build y proxyea `/api` al backend). Ver el README principal, sección «Ejecución con Docker».

## Instalación y ejecución

```bash
cd frontend
npm install
npm run dev
```

Abrir [http://localhost:5173](http://localhost:5173).

El proxy de Vite reenvía `/api/*` a `http://localhost:9000`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (descarga `public/media/` si falta) |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Vista previa del build |
| `npm run media:download` | Descarga portadas TMDB y fallbacks a `public/media/` (requiere red, una vez) |

## Secciones

- Dashboard — resumen de ventas, entradas, funciones y compras
- Cines, Películas, Salas (incl. VIP), Funciones
- Clientes (regular y VIP), Ventas, Compras, Empleados
- **Entradas, Pagos, Insumos, Proveedores** — CRUD dedicado
- **Explorador API** (`/api-explorer`) — los 14 endpoints con POST/PUT por JSON

## Probar todos los endpoints

En cada pantalla de recurso:

| Operación | Cómo probarla |
|-----------|----------------|
| `GET /api/{recurso}` | Listado al cargar la página |
| `GET /api/{recurso}/page` | Panel «Probar paginación» |
| `GET /api/{recurso}/{id}` | Botón «Ver ID» o «Buscar por ID» |
| `POST` | Botón «+ Nuevo …» |
| `PUT` | Botón «Editar» |
| `DELETE` | Botón «Eliminar» |

El **Explorador API** permite editar el body JSON manualmente para casos avanzados.

## Imágenes locales (sin depender de TMDB/Unsplash en runtime)

Las portadas se sirven desde `public/media/` (rutas `/media/movies/...` y `/media/fallback/...`).

Al ejecutar `npm run dev`, `npm run build` o `npm run preview`, si faltan archivos se descargan automáticamente (hace falta red la primera vez).

Descarga manual opcional:

```bash
npm run media:download
```

Conviene commitear `public/media/` para que el resto del equipo no necesite red al levantar el front.

## Despliegue junto al backend (opcional)

```bash
npm run build
cp -r dist/* ../src/main/resources/static/
```

Luego servir la app Spring en el puerto 9000 con los archivos estáticos.
