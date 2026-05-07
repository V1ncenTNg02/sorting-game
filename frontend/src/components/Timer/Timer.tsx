interface Props {
  elapsedSeconds: number
}

function formatTime(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export function Timer({ elapsedSeconds }: Props) {
  return (
    <span className="font-mono text-lg text-gray-700" aria-label="elapsed time">
      ⏱ {formatTime(elapsedSeconds)}
    </span>
  )
}
