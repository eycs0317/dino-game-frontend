interface StartScreenProps {
  show: boolean
}

export function StartScreen({ show }: StartScreenProps) {
  if (!show) return null

  return (
    <div className="start-screen" data-start-screen>
      Press Any Key To Start
    </div>
  )
}
