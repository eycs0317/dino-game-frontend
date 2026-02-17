import { useCallback, useEffect, useRef } from 'react'

/**
 * Audio hook - manages game sound effects
 * Converted from audio logic in dino.js
 */
export function useAudio() {
  const jumpSoundRef = useRef<HTMLAudioElement | undefined>(undefined)
  const hitSoundRef = useRef<HTMLAudioElement | undefined>(undefined)

  useEffect(() => {
    jumpSoundRef.current = new Audio('/audio/press_sound.mp3')
    jumpSoundRef.current.volume = 0.5
    hitSoundRef.current = new Audio('/audio/hit_sound.mp3')
    hitSoundRef.current.volume = 0.5
  }, [])

  const playJump = useCallback(() => {
    if (jumpSoundRef.current) {
      jumpSoundRef.current.currentTime = 0
      jumpSoundRef.current.play().catch(() => {
        // Ignore autoplay policy errors
      })
    }
  }, [])

  const playHit = useCallback(() => {
    if (hitSoundRef.current) {
      hitSoundRef.current.currentTime = 0
      hitSoundRef.current.play().catch(() => {
        // Ignore autoplay policy errors
      })
    }
  }, [])

  return { playJump, playHit }
}
