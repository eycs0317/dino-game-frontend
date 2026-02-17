interface ScoreBoardProps {
  score: number
  highScore: number
}

export function ScoreBoard({ score, highScore }: ScoreBoardProps) {
  return (
    <>
      <div className="score" data-score>{score}</div>
      <div className="highscore" data-highscore>High Score: {highScore}</div>
    </>
  )
}
