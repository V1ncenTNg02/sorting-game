import { useState } from 'react'

const COPY_FEEDBACK_DURATION_MS = 2000

interface Props {
  elapsedSeconds: number
  bestScore: number | null
  sessionId?: string | null
  onReset: () => void
  resetLabel?: string
}

function formatTime(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export function WellDoneModal({
  elapsedSeconds,
  bestScore,
  sessionId,
  onReset,
  resetLabel = 'Play Again',
}: Props) {
  const [copied, setCopied] = useState(false)
  const isNewBest = bestScore !== null && elapsedSeconds < bestScore

  function handleShare(): void {
    const url = `${window.location.origin}/?session=${sessionId}`
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION_MS)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 max-w-sm w-full mx-4">
        <h2 className="text-3xl font-bold text-gray-800">Well Done!</h2>
        <p className="text-gray-500">You sorted everything in</p>
        <span className="text-4xl font-mono font-semibold text-blue-600">
          {formatTime(elapsedSeconds)}
        </span>
        {bestScore !== null && (
          <div className="text-center">
            <p className="text-sm text-gray-400">Best Score</p>
            <span
              className={`text-2xl font-mono font-semibold ${elapsedSeconds <= bestScore ? 'text-green-500' : 'text-gray-500'}`}
            >
              {formatTime(bestScore)}
            </span>
            {isNewBest && (
              <p className="text-xs text-green-600 mt-1">New best!</p>
            )}
          </div>
        )}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onReset}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
          >
            {resetLabel}
          </button>
          {sessionId != null && (
            <button
              onClick={handleShare}
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              {copied ? 'Copied!' : 'Share'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
