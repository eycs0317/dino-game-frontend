import { useCallback, useEffect, useRef, useState } from 'react'
import { getCustomProperty, incrementCustomProperty, setCustomProperty } from '@/utils/helpers'
import { JUMP_SPEED, GRAVITY, DINO_FRAME_COUNT, FRAME_TIME } from '@/utils/physics'

/**
 * Dino hook - manages jump mechanics, gravity physics, and animation frames
 * Converted from dino.js
 */
export function useDino(playJumpSound: () => void, phoneConnected: boolean = false) {
  const dinoRef = useRef<HTMLImageElement>(null)
  const isJumpingRef = useRef(false)
  const yVelocityRef = useRef(0)
  const dinoFrameRef = useRef(0)
  const currentFrameTimeRef = useRef(0)

  const [dinoImage, setDinoImage] = useState('/images/dino-stationary.png')

  const handleRun = useCallback((delta: number, speedScale: number) => {
    if (isJumpingRef.current) {
      setDinoImage('/images/dino-stationary.png')
      return
    }

    currentFrameTimeRef.current += delta * speedScale
    if (currentFrameTimeRef.current >= FRAME_TIME) {
      dinoFrameRef.current = (dinoFrameRef.current + 1) % DINO_FRAME_COUNT
      setDinoImage(`/images/dino-run-${dinoFrameRef.current}.png`)
      currentFrameTimeRef.current -= FRAME_TIME
    }
  }, [])

  const handleJump = useCallback((delta: number) => {
    if (!isJumpingRef.current) return

    incrementCustomProperty(dinoRef.current, '--bottom', yVelocityRef.current * delta)

    if (getCustomProperty(dinoRef.current, '--bottom') <= 0) {
      setCustomProperty(dinoRef.current, '--bottom', 0)
      isJumpingRef.current = false
    }

    yVelocityRef.current -= GRAVITY * delta
  }, [])

  const jump = useCallback(() => {
    if (isJumpingRef.current) return

    yVelocityRef.current = JUMP_SPEED
    isJumpingRef.current = true
    playJumpSound()
  }, [playJumpSound])

  const onKeyJump = useCallback((e: KeyboardEvent) => {
    if (e.code !== 'Space') return
    jump()
  }, [jump])

  const update = useCallback((delta: number, speedScale: number) => {
    handleRun(delta, speedScale)
    handleJump(delta)
  }, [handleRun, handleJump])

  const setup = useCallback(() => {
    isJumpingRef.current = false
    dinoFrameRef.current = 0
    currentFrameTimeRef.current = 0
    yVelocityRef.current = 0
    setCustomProperty(dinoRef.current, '--bottom', 0)
    setDinoImage('/images/dino-stationary.png')
  }, [])

  const setLose = useCallback(() => {
    setDinoImage('/images/dino-lose.png')
  }, [])

  const getRect = useCallback((): DOMRect | null => {
    return dinoRef.current?.getBoundingClientRect() || null
  }, [])

  // Keyboard listener - disabled when phone is connected
  useEffect(() => {
    if (phoneConnected) return
    document.addEventListener('keydown', onKeyJump)
    return () => document.removeEventListener('keydown', onKeyJump)
  }, [onKeyJump, phoneConnected])

  return {
    dinoRef,
    dinoImage,
    update,
    setup,
    setLose,
    getRect,
    jump,
  }
}
