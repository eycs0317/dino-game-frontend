'use client'

import { useEffect, useRef, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { io, Socket } from 'socket.io-client'

const SWIPE_THRESHOLD = 40   // px upward to count as swipe
const JUMP_COOLDOWN_MS = 300

function PhoneController() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session') ?? ''

  const socketRef = useRef<Socket | null>(null)
  const lastJumpRef = useRef(0)
  const touchStartYRef = useRef(0)
  const [connected, setConnected] = useState(false)
  const [jumped, setJumped] = useState(false)

  const emitJump = useCallback(() => {
    const now = Date.now()
    if (now - lastJumpRef.current < JUMP_COOLDOWN_MS) return
    lastJumpRef.current = now

    socketRef.current?.emit('shake', { sessionId })

    setJumped(true)
    setTimeout(() => setJumped(false), 250)
  }, [sessionId])

  // Connect to socket server
  useEffect(() => {
    if (!sessionId) return

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER!)
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('joinSession', { sessionId, role: 'phone' })
      setConnected(true)
    })

    socket.on('disconnect', () => setConnected(false))

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [sessionId])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaY = touchStartYRef.current - e.changedTouches[0].clientY
    // Trigger on swipe up OR a quick tap (small movement)
    if (deltaY > SWIPE_THRESHOLD || Math.abs(deltaY) < 10) {
      emitJump()
    }
  }, [emitJump])

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: jumped ? '#d4edda' : '#f7f7f7',
        transition: 'background 0.2s',
        fontFamily: "'Press Start 2P', cursive",
        gap: '2rem',
        padding: '2rem',
        textAlign: 'center',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
      }}
    >
      <p style={{ fontSize: 11, color: '#535353', margin: 0 }}>
        {connected ? '🟢 Connected' : '🔴 Connecting...'}
      </p>

      <div style={{
        fontSize: 80,
        transform: jumped ? 'translateY(-20px)' : 'translateY(0)',
        transition: 'transform 0.2s ease-out',
      }}>
        🦕
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <p style={{ fontSize: 10, color: '#535353', margin: 0 }}>
          Swipe up to jump
        </p>
        <p style={{ fontSize: 8, color: '#aaa', margin: 0 }}>
          or tap anywhere
        </p>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '2rem',
        fontSize: 7,
        color: '#ccc',
      }}>
        {sessionId.slice(0, 8)}...
      </div>
    </div>
  )
}

export default function PhonePage() {
  return (
    <Suspense>
      <PhoneController />
    </Suspense>
  )
}
