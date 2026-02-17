'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { GameWorld } from './GameWorld'
import { Dino } from './Dino'
import { Ground } from './Ground'
import { Clouds } from './Clouds'
import { CactusList } from './Cactus'
import { ScoreBoard } from './ScoreBoard'
import { StartScreen } from './StartScreen'
import { QRModal } from './QRModal'
import { useGameLoop, type GameState } from '@/hooks/useGameLoop'
import { useDino } from '@/hooks/useDino'
import { useCactus } from '@/hooks/useCactus'
import { useGround } from '@/hooks/useGround'
import { useClouds } from '@/hooks/useClouds'
import { useAudio } from '@/hooks/useAudio'
import { useSocket } from '@/hooks/useSocket'
import { isCollision } from '@/utils/collision'
import { SPEED_SCALE_INCREASE, SCORE_INCREMENT } from '@/utils/physics'

/**
 * Main DinoGame orchestrator component
 * Combines all hooks and coordinates game logic
 * Converted from script.js
 */
export function DinoGame() {
  const [gameState, setGameState] = useState<GameState>('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [phoneConnected, setPhoneConnected] = useState(false)
  const [showModal, setShowModal] = useState(true)
  const [phoneUrl, setPhoneUrl] = useState('')
  const sessionId = useRef(crypto.randomUUID()).current

  const speedScaleRef = useRef(1)
  const gameStateRef = useRef<GameState>('idle')
  const handleStartRef = useRef<() => void>(() => {})
  const { playJump, playHit } = useAudio()

  const dino = useDino(playJump, phoneConnected)
  const cactus = useCactus()
  const ground = useGround()
  const clouds = useClouds()

  // Build the phone URL using the current hostname
  useEffect(() => {
    const host = window.location.hostname
    const port = window.location.port ? `:${window.location.port}` : ''
    setPhoneUrl(`http://${host}${port}/phone?session=${sessionId}`)
  }, [sessionId])

  const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER!

  useSocket(socketServerUrl, sessionId, {
    onShake: () => {
      if (gameStateRef.current === 'idle') {
        handleStartRef.current()
      } else {
        dino.jump()
      }
    },
    onPhoneConnected: () => {
      setPhoneConnected(true)
      setShowModal(false)
    },
  })

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dinoHighScore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  // Save high score to localStorage
  useEffect(() => {
    if (highScore > 0) {
      localStorage.setItem('dinoHighScore', highScore.toString())
    }
  }, [highScore])

  const handleUpdate = useCallback((delta: number) => {
    clouds.update(delta, speedScaleRef.current)
    ground.update(delta, speedScaleRef.current)
    dino.update(delta, speedScaleRef.current)
    cactus.update(delta, speedScaleRef.current)

    speedScaleRef.current += delta * SPEED_SCALE_INCREASE
    setScore(prev => prev + delta * SCORE_INCREMENT)
  }, [clouds, ground, dino, cactus])

  const checkLose = useCallback(() => {
    const dinoRect = dino.getRect()
    if (!dinoRect) return false

    return cactus.getRects().some(rect => isCollision(rect, dinoRect))
  }, [dino, cactus])

  const handleLose = useCallback(() => {
    setGameState('gameOver')
    dino.setLose()
    playHit()

    setHighScore(prev => Math.max(prev, Math.floor(score)))

    setTimeout(() => setGameState('idle'), 100)
  }, [dino, playHit, score])

  const handleStart = useCallback(() => {
    speedScaleRef.current = 1
    setScore(0)
    dino.setup()
    cactus.setup()
    ground.setup()
    clouds.setup()
    setGameState('playing')
  }, [dino, cactus, ground, clouds])

  // Keep refs in sync so socket callbacks always have the latest values
  gameStateRef.current = gameState
  handleStartRef.current = handleStart

  useGameLoop({
    gameState,
    onUpdate: handleUpdate,
    onCheckLose: checkLose,
    onLose: handleLose
  })

  // Start game on any keypress when idle (keyboard fallback when no phone)
  useEffect(() => {
    if (gameState !== 'idle' || phoneConnected) return

    const handler = () => handleStart()
    document.addEventListener('keydown', handler, { once: true })
    return () => document.removeEventListener('keydown', handler)
  }, [gameState, handleStart, phoneConnected])

  return (
    <>
      {showModal && phoneUrl && (
        <QRModal phoneUrl={phoneUrl} phoneConnected={phoneConnected} />
      )}
      <GameWorld>
        <ScoreBoard score={Math.floor(score)} highScore={highScore} />
        <StartScreen show={gameState === 'idle'} />
        <Clouds setRef={clouds.setRef} />
        <Ground setRef={ground.setRef} />
        <Dino ref={dino.dinoRef} image={dino.dinoImage} />
        <CactusList cacti={cactus.cacti} setRef={cactus.setRef} />
      </GameWorld>
    </>
  )
}
