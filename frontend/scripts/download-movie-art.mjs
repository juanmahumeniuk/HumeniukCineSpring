#!/usr/bin/env node
/**
 * Descarga portadas TMDB y fallbacks a frontend/public/media/.
 * Ejecutar: npm run media:download
 */
import { downloadMovieArt } from './movie-art-lib.mjs'

downloadMovieArt({ verbose: true }).catch((err) => {
  console.error(err)
  process.exit(1)
})
