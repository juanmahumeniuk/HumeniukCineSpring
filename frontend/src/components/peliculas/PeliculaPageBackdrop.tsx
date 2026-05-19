import { createPortal } from 'react-dom'

interface PeliculaPageBackdropProps {
  imageUrl: string
}

/** Fondo fijo a viewport (portal en body para evitar recorte por transform del layout). */
export function PeliculaPageBackdrop({ imageUrl }: PeliculaPageBackdropProps) {
  return createPortal(
    <div className="pelicula-detail-backdrop" aria-hidden>
      <img
        src={imageUrl}
        alt=""
        className="pelicula-detail-backdrop__image"
        draggable={false}
      />
      <div className="pelicula-detail-backdrop__veil" />
      <div className="pelicula-detail-backdrop__gradient" />
    </div>,
    document.body,
  )
}
