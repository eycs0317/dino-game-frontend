'use client'

import { QRCodeSVG } from 'qrcode.react'

interface QRModalProps {
  phoneUrl: string
  phoneConnected: boolean
}

export function QRModal({ phoneUrl, phoneConnected }: QRModalProps) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        fontFamily: "'Press Start 2P', cursive",
        maxWidth: 360,
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 10, color: '#535353', margin: 0 }}>
          Scan to use your phone as controller
        </p>

        <div style={{ padding: 12, background: '#f7f7f7', borderRadius: 8 }}>
          <QRCodeSVG value={phoneUrl} size={200} />
        </div>

        <p style={{ fontSize: 8, color: '#888', margin: 0, wordBreak: 'break-all' }}>
          {phoneUrl}
        </p>

        {phoneConnected ? (
          <p style={{ fontSize: 9, color: '#4caf50', margin: 0 }}>
            ✓ Phone connected! Shake to jump.
          </p>
        ) : (
          <p style={{ fontSize: 9, color: '#aaa', margin: 0 }}>
            Waiting for phone...
          </p>
        )}
      </div>
    </div>
  )
}
