import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

interface UseSocketOptions {
  onShake?: () => void
  onPhoneConnected?: () => void
}

/**
 * Manages the socket.io client connection for the desktop game.
 * Connects to the socket server and handles shake + phone-connected events.
 */
export function useSocket(serverUrl: string, sessionId: string, options: UseSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null)
  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    const socket = io(serverUrl)
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('joinSession', { sessionId, role: 'desktop' })
    })

    socket.on('shake', () => {
      optionsRef.current.onShake?.()
    })

    socket.on('phoneConnected', () => {
      optionsRef.current.onPhoneConnected?.()
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [serverUrl, sessionId])
}
