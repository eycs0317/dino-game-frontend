import { useEffect, useRef } from 'react'
import { setCustomProperty } from '@/utils/helpers'
import type { Cactus as CactusType } from '@/hooks/useCactus'

interface CactusProps {
  cactus: CactusType
  setRef: (id: number, ref: HTMLImageElement | null) => void
}

export function Cactus({ cactus, setRef }: CactusProps) {
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (ref.current) {
      setCustomProperty(ref.current, '--left', cactus.left)
    }
  }, [cactus.left])

  return (
    <img
      ref={element => {
        ref.current = element
        setRef(cactus.id, element)
      }}
      src="/images/cactus.png"
      className="cactus"
      data-cactus
      alt="cactus"
    />
  )
}

interface CactusListProps {
  cacti: CactusType[]
  setRef: (id: number, ref: HTMLImageElement | null) => void
}

export function CactusList({ cacti, setRef }: CactusListProps) {
  return (
    <>
      {cacti.map(cactus => (
        <Cactus key={cactus.id} cactus={cactus} setRef={setRef} />
      ))}
    </>
  )
}
