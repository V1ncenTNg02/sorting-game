import { useGameStore } from './store/useGameStore'
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen'
import { GameBoard } from './components/GameBoard/GameBoard'
import { WellDoneModal } from './components/WellDoneModal/WellDoneModal'

function App() {
  const status        = useGameStore(s => s.status)
  const unsortedItems = useGameStore(s => s.unsortedItems)
  const buckets       = useGameStore(s => s.buckets)
  const bucketCounts  = useGameStore(s => s.bucketCounts)
  const elapsedSeconds = useGameStore(s => s.elapsedSeconds)
  const startGame     = useGameStore(s => s.startGame)
  const handleDragEnd = useGameStore(s => s.handleDragEnd)
  const resetGame     = useGameStore(s => s.resetGame)

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (status === 'idle') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Colour Shape Sorting Game</h1>
          <p className="text-sm text-gray-400 mb-8">Sort all shapes into their correct target buckets.</p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <GameBoard
        unsortedItems={unsortedItems}
        buckets={buckets}
        bucketCounts={bucketCounts}
        elapsedSeconds={elapsedSeconds}
        onDragEnd={handleDragEnd}
        onReset={resetGame}
      />
      {status === 'complete' && (
        <WellDoneModal elapsedSeconds={elapsedSeconds} onReset={resetGame} />
      )}
    </>
  )
}

export default App
