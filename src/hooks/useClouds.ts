import { useCallback, useRef } from 'react'
import { getCustomProperty, incrementCustomProperty, setCustomProperty } from '@/utils/helpers'
import { CLOUD_SPEED } from '@/utils/physics'

/**
 * Clouds hook - manages infinite scrolling clouds
 * Converted from clouds.js
 */
export function useClouds() {
  const cloudRefs = useRef<(HTMLImageElement | null)[]>([null, null])

  const setRef = useCallback((index: number, ref: HTMLImageElement | null) => {
    cloudRefs.current[index] = ref
  }, [])

  const update = useCallback((delta: number, speedScale: number) => {
    cloudRefs.current.forEach(cloud => {
      if (!cloud) return
      incrementCustomProperty(cloud, '--left', delta * speedScale * CLOUD_SPEED * -1)

      if (getCustomProperty(cloud, '--left') <= -300) {
        incrementCustomProperty(cloud, '--left', 600)
      }
    })
  }, [])

  const setup = useCallback(() => {
    setCustomProperty(cloudRefs.current[0], '--left', 0)
    setCustomProperty(cloudRefs.current[1], '--left', 300)
  }, [])

  return {
    setRef,
    update,
    setup
  }
}
