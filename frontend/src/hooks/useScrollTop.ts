import { useEffect, useState } from 'react'

const FADE_DISTANCE = 96

export function useScrollTop(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)
  const [fade, setFade] = useState(0)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setScrolled(y > threshold)
      setFade(Math.min(1, y / FADE_DISTANCE))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return { scrolled, fade }
}
