import { DinoGame } from '@/components/DinoGame/DinoGame'
import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <Image
        src="/images/logo-dino.png"
        alt="dino-logo"
        width={100}
        height={100}
        className="logo"
        priority
      />
      <DinoGame />
    </main>
  )
}
