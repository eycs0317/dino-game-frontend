# Dino Game Clone - Next.js

A Google Chrome Dino Game clone built with Next.js 15, TypeScript, and React 19 — with a **phone controller** feature that lets you use your phone as a gamepad via QR code.

## Features

- Authentic dino game mechanics with jump physics
- Dynamic cactus spawning and collision detection
- Score tracking with localStorage persistence
- Sound effects (jump and collision)
- Responsive design that scales to any screen size
- **Phone controller** — scan a QR code on your phone and swipe up to jump
- Real-time communication via Socket.IO

## Architecture

This project is split into two parts:

| Part                 | Repo / Host                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| Frontend (this repo) | [dino-game-frontend.vercel.app](https://dino-game-frontend.vercel.app/) — deployed on **Vercel**   |
| Socket.IO Server     | [eycs0317/dino-game-server](https://github.com/eycs0317/dino-game-server) — deployed on **Render** |

## Live Demo

[https://dino-game-frontend.vercel.app/](https://dino-game-frontend.vercel.app/)

## Screenshots

<!-- Game screenshot -->

![Gameplay](./public/screenshots/gameplay.png)

<!-- QR code modal -->

![QR Modal](./public/screenshots/modal.png)

<!-- Phone controller -->

![Phone Controller](./public/screenshots/phone-controller.png)

## How to Play

**Desktop:**

- A QR code modal appears when the page loads
- Scan it with your phone to use it as a controller
- Or press any key to skip and play with the keyboard (Space to jump)

**Phone controller:**

- Scan the QR code on the desktop
- Swipe up or tap anywhere on the phone screen to make the dino jump

## Tech Stack

- **Next.js 15** — React framework with App Router
- **TypeScript** — Type-safe code
- **React 19** — Modern React with hooks
- **Socket.IO Client** — Real-time phone-to-desktop communication
- **qrcode.react** — QR code generation

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main game page
│   ├── phone/
│   │   └── page.tsx          # Phone controller page (opened via QR code)
│   └── globals.css
├── components/DinoGame/
│   ├── DinoGame.tsx          # Main game orchestrator
│   ├── QRModal.tsx           # QR code modal shown on load
│   ├── GameWorld.tsx         # Responsive scaling container
│   ├── Dino.tsx
│   ├── Ground.tsx
│   ├── Clouds.tsx
│   ├── Cactus.tsx
│   ├── ScoreBoard.tsx
│   └── StartScreen.tsx
├── hooks/
│   ├── useGameLoop.ts        # Core game loop (requestAnimationFrame)
│   ├── useDino.ts            # Jump physics and animation
│   ├── useSocket.ts          # Socket.IO client connection
│   ├── useCactus.ts
│   ├── useGround.ts
│   ├── useClouds.ts
│   └── useAudio.ts
└── utils/
    ├── helpers.ts
    ├── physics.ts
    └── collision.ts
```

## Phone Controller Flow

1. Desktop generates a unique `sessionId` and joins the socket server room
2. QR code modal shows — URL encodes the `sessionId` and points to `/phone`
3. Phone scans QR → opens `/phone?session=<id>` → joins the same room
4. Desktop receives `phoneConnected` → modal closes, keyboard controls disabled
5. Phone swipe/tap → socket emits `shake` → desktop receives it → dino jumps
