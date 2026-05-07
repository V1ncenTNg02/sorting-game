const COLS = 4
const ROWS = 2

export function GhostGrid() {
  return (
    <div
      className="absolute bottom-10 right-10 pointer-events-none opacity-15"
      style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 34px)`, gap: '5px' }}
      aria-hidden="true"
    >
      {Array.from({ length: COLS * ROWS }).map((_, i) => (
        <div key={i} className="w-[34px] h-[34px] border border-gray-400 rounded-sm" />
      ))}
    </div>
  )
}
