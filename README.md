# Dino Game Clone - Next.js

A Google Chrome Dino Game clone built with Next.js 15, TypeScript, and React 19.

## Features

- 🦖 Authentic dino game mechanics with jump physics
- 🌵 Dynamic cactus spawning and collision detection
- 📊 Score tracking with localStorage persistence
- 🎵 Sound effects (jump and collision)
- 📱 Responsive design that scales to any screen size
- ⚡ Built with modern React hooks and TypeScript

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to play the game.

## How to Play

- Press any key to start the game
- Press **Space** to make the dino jump
- Avoid the cacti!
- Try to beat your high score

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe code
- **React 19** - Modern React with hooks
- **CSS Custom Properties** - Performant animations

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   └── DinoGame/    # Game components
├── hooks/           # Custom React hooks
└── utils/           # Utility functions
```

## Detailed Project Structure

```
dino-game-nextjs/
├── public/
│   ├── images/              # All game assets
│   │   ├── cactus.png
│   │   ├── clouds.png
│   │   ├── dino-lose.png
│   │   ├── dino-run-0.png
│   │   ├── dino-run-1.png
│   │   ├── dino-stationary.png
│   │   ├── favicon.ico
│   │   ├── ground.png
│   │   └── logo-dino.png
│   └── audio/               # Sound effects
│       ├── hit_sound.mp3
│       └── press_sound.mp3
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with Google Fonts
│   │   ├── page.tsx         # Main game page
│   │   └── globals.css      # Global styles
│   ├── components/DinoGame/
│   │   ├── DinoGame.tsx     # Main game orchestrator
│   │   ├── GameWorld.tsx    # Responsive scaling container
│   │   ├── Dino.tsx         # Player character component
│   │   ├── Ground.tsx       # Scrolling ground component
│   │   ├── Clouds.tsx       # Background clouds component
│   │   ├── Cactus.tsx       # Dynamic obstacle component
│   │   ├── ScoreBoard.tsx   # Score display component
│   │   └── StartScreen.tsx  # Start overlay component
│   ├── hooks/
│   │   ├── useGameLoop.ts   # Core game loop with requestAnimationFrame
│   │   ├── useDino.ts       # Jump physics and animation
│   │   ├── useCactus.ts     # Obstacle spawning and movement
│   │   ├── useGround.ts     # Ground scrolling logic
│   │   ├── useClouds.ts     # Cloud scrolling logic
│   │   └── useAudio.ts      # Sound effects management
│   └── utils/
│       ├── helpers.ts       # CSS custom property utilities
│       ├── physics.ts       # Game physics constants
│       └── collision.ts     # Collision detection logic
```

## Key Features Preserved

- ✅ **Jump Physics** - Exact same gravity and jump mechanics
- ✅ **Collision Detection** - Precise hit detection
- ✅ **Dynamic Spawning** - Random cactus generation
- ✅ **Score Tracking** - With localStorage persistence for high scores
- ✅ **Sound Effects** - Jump and collision sounds
- ✅ **Responsive Design** - Scales to any screen size
- ✅ **CSS Custom Properties** - Performant animation system

## Technical Improvements

- **TypeScript** - Full type safety throughout the codebase
- **React Hooks** - Modern React patterns with custom hooks
- **Component Architecture** - Modular, reusable components
- **State Management** - Hybrid approach (useRef for physics, useState for UI)
- **Performance** - Preserved the efficient CSS custom properties approach
- **Build System** - Next.js optimization and bundling

## Migration Notes

This project was migrated from a vanilla JavaScript implementation to Next.js with TypeScript while preserving all the original game mechanics and physics.

- The ESLint warnings about using `<img>` instead of `next/image` are intentional - we need direct DOM refs for CSS custom property manipulation
- All game physics and mechanics are identical to the original
- High scores are now persisted in localStorage
- The project uses Next.js 15 with the App Router and React 19

The game should work exactly like the original version, but now with all the benefits of Next.js and TypeScript!
