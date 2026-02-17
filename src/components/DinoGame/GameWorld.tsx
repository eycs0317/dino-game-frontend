import { useEffect, useRef, ReactNode } from 'react'
import { WORLD_WIDTH, WORLD_HEIGHT } from '@/utils/physics'

interface GameWorldProps {
  children: ReactNode
}

/**
 * GameWorld component - handles responsive scaling of the game container
 * Converted from setPixelToWorldScale function in script.js
 */
export function GameWorld({ children }: GameWorldProps) {
  const worldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function setPixelToWorldScale() {
      if (!worldRef.current) return

      let worldToPixelScale
      if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH
      } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT
      }

      worldRef.current.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
      worldRef.current.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
    }

    setPixelToWorldScale()
    window.addEventListener('resize', setPixelToWorldScale)
    return () => window.removeEventListener('resize', setPixelToWorldScale)
  }, [])

  return (
    <div ref={worldRef} className="world" data-world>
      {children}
    </div>
  )
}
