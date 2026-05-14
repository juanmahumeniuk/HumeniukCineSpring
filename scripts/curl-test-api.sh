#!/usr/bin/env bash
# Prueba rápida de los endpoints REST (misma convención que los controllers).
# Uso:
#   ./scripts/curl-test-api.sh
#   BASE=http://127.0.0.1:9000 ./scripts/curl-test-api.sh
#
# Requiere la app en ejecución (por defecto server.port=9000).

set -u

BASE="${BASE:-http://localhost:9000}"
CURL=(curl -sS -w "\nHTTP %{http_code}\n" -H "Accept: application/json" -H "Content-Type: application/json")

echo "Base URL: $BASE"
echo

get_all() {
  local path="$1"
  echo "========== GET ${path} =========="
  "${CURL[@]}" -X GET "${BASE}${path}"
  echo
}

get_page() {
  local path="$1"
  echo "========== GET ${path}/page?page=0&size=2 =========="
  "${CURL[@]}" -X GET "${BASE}${path}/page?page=0&size=2"
  echo
}

post_json() {
  local path="$1"
  local body="$2"
  echo "========== POST ${path} =========="
  "${CURL[@]}" -X POST "${BASE}${path}" -d "${body}"
  echo
}

# --- Lecturas (listado y paginación) ---
APIS=(
  "/api/cines"
  "/api/peliculas"
  "/api/salas"
  "/api/salas-vip"
  "/api/funciones"
  "/api/clientes"
  "/api/clientes-vip"
  "/api/empleados"
  "/api/entradas"
  "/api/compras"
  "/api/ventas"
  "/api/pagos"
  "/api/insumos"
  "/api/proveedores"
)

for api in "${APIS[@]}"; do
  get_all "$api"
  get_page "$api"
done

# --- Ejemplos de alta (ajusta IDs / relaciones si tu BD lo exige) ---
echo "========== POST de ejemplo (pueden fallar si hay FKs obligatorias) =========="
post_json "/api/peliculas" '{"titulo":"Pelicula curl","genero":"COMEDIA"}'
post_json "/api/cines" '{"nombre":"Cine curl","direccion":"Falsa 123"}'
post_json "/api/insumos" '{"nombre":"Pochoclo","precio":500}'
post_json "/api/proveedores" '{"nombre":"Proveedor curl","telefono":"111","direccion":"Calle 1"}'
post_json "/api/pagos" '{"monto":1500,"tipo":"EFECTIVO"}'
post_json "/api/clientes" '{"nombre":"Cliente curl","email":"c@test.com"}'
post_json "/api/empleados" '{"nombre":"Empleado curl","dni":12345678}'

echo "Listo. Para GET por id, PUT y DELETE (sustituir ID):"
cat <<'EOF'
  curl -sS "${BASE}/api/cines/1"
  curl -sS -X PUT "${BASE}/api/cines/1" -H "Content-Type: application/json" -d '{"nombre":"Actualizado","direccion":"Nueva 456"}'
  curl -sS -X DELETE "${BASE}/api/cines/1"
EOF
