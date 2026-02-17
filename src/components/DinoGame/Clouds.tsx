interface CloudsProps {
  setRef: (index: number, ref: HTMLImageElement | null) => void
}

export function Clouds({ setRef }: CloudsProps) {
  return (
    <>
      <img
        ref={ref => setRef(0, ref)}
        src="/images/clouds.png"
        className="clouds"
        data-clouds
        alt="clouds"
      />
      <img
        ref={ref => setRef(1, ref)}
        src="/images/clouds.png"
        className="clouds"
        data-clouds
        alt="clouds"
      />
    </>
  )
}
