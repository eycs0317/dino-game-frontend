import { useCallback, useRef } from 'react'
import { getCustomProperty, incrementCustomProperty, setCustomProperty } from '@/utils/helpers'
import { GROUND_SPEED } from '@/utils/physics'

/**
 * Ground hook - manages infinite scrolling ground
 * Converted from ground.js
 */
export function useGround() {
  const groundRefs = useRef<(HTMLImageElement | null)[]>([null, null])

  const setRef = useCallback((index: number, ref: HTMLImageElement | null) => {
    groundRefs.current[index] = ref
  }, [])

  const update = useCallback((delta: number, speedScale: number) => {
    groundRefs.current.forEach(ground => {
      if (!ground) return
      incrementCustomProperty(ground, '--left', delta * speedScale * GROUND_SPEED * -1)

      if (getCustomProperty(ground, '--left') <= -300) {
        incrementCustomProperty(ground, '--left', 600)
      }
    })
  }, [])

  const setup = useCallback(() => {
    setCustomProperty(groundRefs.current[0], '--left', 0)
    setCustomProperty(groundRefs.current[1], '--left', 300)
  }, [])

  return {
    setRef,
    update,
    setup
  }
}
