interface GroundProps {
  setRef: (index: number, ref: HTMLImageElement | null) => void
}

export function Ground({ setRef }: GroundProps) {
  return (
    <>
      <img
        ref={ref => setRef(0, ref)}
        src="/images/ground.png"
        className="ground"
        data-ground
        alt="ground"
      />
      <img
        ref={ref => setRef(1, ref)}
        src="/images/ground.png"
        className="ground"
        data-ground
        alt="ground"
      />
    </>
  )
}
