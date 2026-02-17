import { useCallback, useRef, useState } from 'react'
import { randomNumberBetween } from '@/utils/helpers'
import { CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX, CACTUS_SPEED } from '@/utils/physics'

export interface Cactus {
  id: number
  left: number
}

/**
 * Cactus hook - manages dynamic cactus spawning and movement
 * Converted from cactus.js
 */
export function useCactus() {
  const [cacti, setCacti] = useState<Cactus[]>([])
  const nextCactusTimeRef = useRef(CACTUS_INTERVAL_MIN)
  const cactusRefsMap = useRef<Map<number, HTMLImageElement | null>>(new Map())

  const update = useCallback((delta: number, speedScale: number) => {
    // Update cactus positions and remove off-screen ones
    setCacti(prev =>
      prev
        .map(c => ({ ...c, left: c.left - delta * speedScale * CACTUS_SPEED }))
        .filter(c => c.left > -100)
    )

    // Spawn new cactus
    nextCactusTimeRef.current -= delta
    if (nextCactusTimeRef.current <= 0) {
      setCacti(prev => [...prev, { id: Date.now(), left: 100 }])
      nextCactusTimeRef.current = randomNumberBetween(
        CACTUS_INTERVAL_MIN,
        CACTUS_INTERVAL_MAX
      ) / speedScale
    }
  }, [])

  const setup = useCallback(() => {
    setCacti([])
    nextCactusTimeRef.current = CACTUS_INTERVAL_MIN
    cactusRefsMap.current.clear()
  }, [])

  const setRef = useCallback((id: number, ref: HTMLImageElement | null) => {
    if (ref) {
      cactusRefsMap.current.set(id, ref)
    } else {
      cactusRefsMap.current.delete(id)
    }
  }, [])

  const getRects = useCallback((): DOMRect[] => {
    const rects: DOMRect[] = []
    cactusRefsMap.current.forEach(ref => {
      if (ref) {
        rects.push(ref.getBoundingClientRect())
      }
    })
    return rects
  }, [])

  return {
    cacti,
    update,
    setup,
    setRef,
    getRects
  }
}
