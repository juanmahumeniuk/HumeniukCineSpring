import { createWriteStream } from 'node:fs'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pipeline } from 'node:stream/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const FRONTEND_ROOT = join(__dirname, '..')
export const MANIFEST_PATH = join(FRONTEND_ROOT, 'src/data/movie-art-manifest.json')
export const MOVIES_DIR = join(FRONTEND_ROOT, 'public/media/movies')
export const FALLBACK_DIR = join(FRONTEND_ROOT, 'public/media/fallback')
export const READY_MARKER = join(FRONTEND_ROOT, 'public/media/.media-ready')

const TMDB_BASE = 'https://image.tmdb.org/t/p'
const SIZES = ['w500', 'w1280']

export async function loadManifest() {
  return JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))
}

export function manifestFingerprint(manifest) {
  return createHash('sha256').update(JSON.stringify(manifest)).digest('hex')
}

export function listRequiredFiles(manifest) {
  const files = []
  const paths = [...new Set(Object.values(manifest.movies))]

  for (const path of paths) {
    const id = path.replace(/^\//, '').replace(/\.jpg$/i, '')
    for (const size of SIZES) {
      files.push(join(MOVIES_DIR, `${id}-${size}.jpg`))
    }
  }

  for (const { file } of manifest.remoteFallbacks) {
    files.push(join(FALLBACK_DIR, file))
  }

  return files
}

async function fileExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export async function isMediaComplete() {
  const manifest = await loadManifest()
  const required = listRequiredFiles(manifest)

  for (const file of required) {
    if (!(await fileExists(file))) return false
  }
  return true
}

async function download(url, dest) {
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} — ${url}`)
  }
  await mkdir(dirname(dest), { recursive: true })
  await pipeline(res.body, createWriteStream(dest))
}

/**
 * @param {{ verbose?: boolean }} options
 */
export async function downloadMovieArt(options = {}) {
  const { verbose = true } = options
  const log = verbose ? console.log.bind(console) : () => {}
  const manifest = await loadManifest()
  const paths = [...new Set(Object.values(manifest.movies))]

  await mkdir(MOVIES_DIR, { recursive: true })
  await mkdir(FALLBACK_DIR, { recursive: true })

  let ok = 0
  let fail = 0

  log(`TMDB: ${paths.length} películas × ${SIZES.length} tamaños…`)
  for (const path of paths) {
    const id = path.replace(/^\//, '').replace(/\.jpg$/i, '')
    for (const size of SIZES) {
      const dest = join(MOVIES_DIR, `${id}-${size}.jpg`)
      const url = `${TMDB_BASE}/${size}${path}`
      try {
        await download(url, dest)
        log(`  ✓ ${id}-${size}.jpg`)
        ok++
      } catch (err) {
        console.error(`  ✗ ${url}: ${err.message}`)
        fail++
      }
    }
  }

  log(`\nFallbacks: ${manifest.remoteFallbacks.length} archivos…`)
  for (const { file, url } of manifest.remoteFallbacks) {
    const dest = join(FALLBACK_DIR, file)
    try {
      await download(url, dest)
      log(`  ✓ ${file}`)
      ok++
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`)
      fail++
    }
  }

  const readme = `# Arte local de películas

Generado con \`npm run media:download\`. No editar a mano.

- \`movies/\` — portadas TMDB (w500 + w1280)
- \`fallback/\` — imágenes por género cuando no hay match de título
`
  await writeFile(join(FRONTEND_ROOT, 'public/media/README.md'), readme)

  const required = listRequiredFiles(manifest)
  if (fail > 0) {
    throw new Error(`Descarga incompleta: ${fail} error(es), ${ok} OK`)
  }

  await writeFile(
    READY_MARKER,
    JSON.stringify(
      {
        fingerprint: manifestFingerprint(manifest),
        count: required.length,
        downloadedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  )

  log(`\nListo: ${ok} archivos en public/media/`)
  return { ok, fail }
}
