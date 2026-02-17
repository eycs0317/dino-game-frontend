'use client'

import { useEffect, useRef, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { io, Socket } from 'socket.io-client'

const SHAKE_THRESHOLD = 15
const SHAKE_COOLDOWN_MS = 600

function PhoneController() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session') ?? ''

  const socketRef = useRef<Socket | null>(null)
  const lastShakeRef = useRef(0)
  const [connected, setConnected] = useState(false)
  const [shook, setShook] = useState(false)

  const emitShake = useCallback(() => {
    const now = Date.now()
    if (now - lastShakeRef.current < SHAKE_COOLDOWN_MS) return
    lastShakeRef.current = now

    socketRef.current?.emit('shake', { sessionId })

    // Flash feedback
    setShook(true)
    setTimeout(() => setShook(false), 300)
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

  // Shake detection via DeviceMotion
  useEffect(() => {
    let prevX = 0, prevY = 0, prevZ = 0

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity
      if (!acc) return

      const dx = Math.abs((acc.x ?? 0) - prevX)
      const dy = Math.abs((acc.y ?? 0) - prevY)
      const dz = Math.abs((acc.z ?? 0) - prevZ)

      prevX = acc.x ?? 0
      prevY = acc.y ?? 0
      prevZ = acc.z ?? 0

      if (dx + dy + dz > SHAKE_THRESHOLD) {
        emitShake()
      }
    }

    // iOS 13+ requires permission
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof (DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
    ) {
      // Permission will be requested via button tap (see UI below)
      return
    }

    window.addEventListener('devicemotion', handleMotion)
    return () => window.removeEventListener('devicemotion', handleMotion)
  }, [emitShake])

  const requestMotionPermission = async () => {
    const DME = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> }
    if (typeof DME.requestPermission === 'function') {
      const result = await DME.requestPermission()
      if (result !== 'granted') return

      let prevX = 0, prevY = 0, prevZ = 0
      const handleMotion = (e: DeviceMotionEvent) => {
        const acc = e.accelerationIncludingGravity
        if (!acc) return
        const dx = Math.abs((acc.x ?? 0) - prevX)
        const dy = Math.abs((acc.y ?? 0) - prevY)
        const dz = Math.abs((acc.z ?? 0) - prevZ)
        prevX = acc.x ?? 0
        prevY = acc.y ?? 0
        prevZ = acc.z ?? 0
        if (dx + dy + dz > SHAKE_THRESHOLD) emitShake()
      }
      window.addEventListener('devicemotion', handleMotion)
    }
  }

  const needsPermission =
    typeof DeviceMotionEvent !== 'undefined' &&
    typeof (DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: shook ? '#d4edda' : '#f7f7f7',
      transition: 'background 0.2s',
      fontFamily: "'Press Start 2P', cursive",
      gap: '1.5rem',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: 11, color: '#535353', margin: 0 }}>
        {connected ? '🟢 Connected' : '🔴 Connecting...'}
      </p>

      <div style={{
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: shook ? '#4caf50' : '#535353',
        transition: 'background 0.2s, transform 0.1s',
        transform: shook ? 'scale(1.15)' : 'scale(1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 40,
        cursor: 'pointer',
        userSelect: 'none',
      }}
        onClick={emitShake}
        onTouchStart={(e) => { e.preventDefault(); emitShake() }}
      >
        🦕
      </div>

      <p style={{ fontSize: 9, color: '#888', margin: 0 }}>
        Shake phone or tap dino to jump
      </p>

      {needsPermission && (
        <button
          onClick={requestMotionPermission}
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: 9,
            padding: '0.75rem 1rem',
            background: '#535353',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Enable Shake (iOS)
        </button>
      )}
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
