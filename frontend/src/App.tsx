import { useEffect, useState } from 'react'
import { useGameStore } from './store/useGameStore'
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen'
import { GameBoard } from './components/GameBoard/GameBoard'
import { WellDoneModal } from './components/WellDoneModal/WellDoneModal'

function App() {
  const sessionParam = new URLSearchParams(window.location.search).get('session')
  const [isLoadingSharedGame, setIsLoadingSharedGame] = useState(Boolean(sessionParam))
  const status          = useGameStore(s => s.status)
  const unsortedItems   = useGameStore(s => s.unsortedItems)
  const buckets         = useGameStore(s => s.buckets)
  const bucketCounts    = useGameStore(s => s.bucketCounts)
  const elapsedSeconds  = useGameStore(s => s.elapsedSeconds)
  const bestScore       = useGameStore(s => s.bestScore)
  const sessionId       = useGameStore(s => s.sessionId)
  const sharedGame      = useGameStore(s => s.sharedGame)
  const loadBestScore   = useGameStore(s => s.loadBestScore)
  const startGame       = useGameStore(s => s.startGame)
  const handleDragStart = useGameStore(s => s.handleDragStart)
  const handleDragEnd   = useGameStore(s => s.handleDragEnd)
  const resetGame       = useGameStore(s => s.resetGame)
  const loadSharedGame  = useGameStore(s => s.loadSharedGame)

  useEffect(() => {
    void loadBestScore()
  }, [loadBestScore])

  useEffect(() => {
    if (sessionParam && sharedGame?.id !== sessionParam) {
      setIsLoadingSharedGame(true)
      void loadSharedGame(sessionParam).finally(() => setIsLoadingSharedGame(false))
    }
  }, [loadSharedGame, sessionParam, sharedGame?.id])

  const sharedGameModal = sharedGame?.completed && sharedGame.durationMs !== null ? (
    <WellDoneModal
      elapsedSeconds={Math.round(sharedGame.durationMs / 1000)}
      bestScore={bestScore}
      sessionId={sharedGame.id}
      onReset={startGame}
      resetLabel="Play Game"
    />
  ) : null

  const completionModal = status === 'complete' && !sharedGame ? (
    <WellDoneModal
      elapsedSeconds={elapsedSeconds}
      bestScore={bestScore}
      sessionId={sessionId}
      onReset={resetGame}
    />
  ) : null

  if (sharedGameModal) {
    return sharedGameModal
  }

  if (status === 'loading' || isLoadingSharedGame) {
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
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onReset={resetGame}
      />
      {sharedGameModal ?? completionModal}
    </>
  )
}

export default App
