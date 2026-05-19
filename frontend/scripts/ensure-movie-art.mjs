#!/usr/bin/env node
/**
 * Comprueba que exista el arte local; si falta, lo descarga antes de Vite.
 */
import { downloadMovieArt, isMediaComplete } from './movie-art-lib.mjs'

async function main() {
  if (await isMediaComplete()) {
    return
  }

  console.log('\n[media] Arte local no encontrado. Descargando portadas (requiere red)…\n')
  await downloadMovieArt({ verbose: true })
  console.log('[media] Descarga finalizada.\n')
}

main().catch((err) => {
  console.error('\n[media] Error:', err.message)
  console.error('[media] Reintentá con: npm run media:download\n')
  process.exit(1)
})
