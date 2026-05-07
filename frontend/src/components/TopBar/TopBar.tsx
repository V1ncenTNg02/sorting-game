function formatTime(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

interface Props {
  elapsed: number
  itemsLeft: number
  onReset: () => void
}

export function TopBar({ elapsed, itemsLeft, onReset }: Props) {
  return (
    <div className="flex items-center justify-between px-5 py-2 border-b border-gray-200 bg-white shrink-0">
      <div className="flex items-center gap-5 text-sm text-gray-600">
        <span>
          Time:{' '}
          <span className="font-mono font-medium text-gray-800" aria-label="elapsed time">
            {formatTime(elapsed)}
          </span>
        </span>
        <span>
          Items Left:{' '}
          <span className="font-medium text-gray-800" aria-label="items left">
            {itemsLeft}
          </span>
        </span>
      </div>
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        aria-label="reset game"
      >
        ↺ Reset
      </button>
    </div>
  )
}
