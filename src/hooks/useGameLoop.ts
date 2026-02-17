import { useEffect, useRef } from 'react'

export type GameState = 'idle' | 'playing' | 'gameOver'

interface UseGameLoopProps {
  gameState: GameState
  onUpdate: (delta: number) => void
  onCheckLose: () => boolean
  onLose: () => void
}

/**
 * Core game loop hook using requestAnimationFrame
 * Manages delta time calculation and game state control
 */
export function useGameLoop({ gameState, onUpdate, onCheckLose, onLose }: UseGameLoopProps) {
  const lastTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (gameState !== 'playing') {
      lastTimeRef.current = null
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    function loop(time: number) {
      if (lastTimeRef.current == null) {
        lastTimeRef.current = time
        animationFrameRef.current = requestAnimationFrame(loop)
        return
      }

      const delta = time - lastTimeRef.current

      onUpdate(delta)

      if (onCheckLose()) {
        onLose()
        return
      }

      lastTimeRef.current = time
      animationFrameRef.current = requestAnimationFrame(loop)
    }

    animationFrameRef.current = requestAnimationFrame(loop)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameState, onUpdate, onCheckLose, onLose])
}
