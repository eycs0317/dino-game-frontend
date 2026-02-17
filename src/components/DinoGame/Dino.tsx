import { forwardRef } from 'react'

interface DinoProps {
  image: string
}

export const Dino = forwardRef<HTMLImageElement, DinoProps>(({ image }, ref) => {
  return (
    <img
      ref={ref}
      src={image}
      className="dino"
      data-dino
      alt="dino"
    />
  )
})

Dino.displayName = 'Dino'
