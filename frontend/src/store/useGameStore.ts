import { create } from 'zustand'
import type { DragEndEvent } from '@dnd-kit/core'
import { ShapeItem } from '../domain/ShapeItem'
import { Bucket } from '../domain/Bucket'
import { GameService } from '../services/GameService'
import { DragDropService } from '../services/DragDropService'
import { ApiService } from '../services/ApiService'
import type { IApiService } from '../services/ApiService'
import type { GameStatus } from '../types/game.types'

interface GameStore {
  status: GameStatus
  unsortedItems: ShapeItem[]
  buckets: Bucket[]
  bucketCounts: Record<string, number>
  elapsedSeconds: number
  sessionId: string | null
  bestScore: number | null
  loadBestScore(): Promise<void>
  startGame(): Promise<void>
  handleDragEnd(event: DragEndEvent): void
  resetGame(): void
}

const gameService = new GameService()
const dragDropService = new DragDropService()
const apiService: IApiService = new ApiService()

let timerInterval: ReturnType<typeof setInterval> | null = null

function clearTimer(): void {
  if (timerInterval !== null) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function startTimer(): void {
  clearTimer()
  timerInterval = setInterval(() => {
    useGameStore.setState(s =>
      s.status === 'playing' ? { elapsedSeconds: s.elapsedSeconds + 1 } : {}
    )
  }, 1000)
}

export const useGameStore = create<GameStore>(set => ({
  status: 'loading',
  unsortedItems: [],
  buckets: [],
  bucketCounts: {},
  elapsedSeconds: 0,
  sessionId: null,
  bestScore: null,

  async loadBestScore() {
    const score = await apiService.getBestScore()
    const bestScore = score !== null ? Math.round(score.value / 1000) : null
    set({ bestScore })
    console.debug('[Game] best score loaded:', bestScore)
  },

  async startGame() {
    const items = gameService.generateItems()
    const buckets = gameService.generateBuckets()
    const initialCounts: Record<string, number> = {}
    buckets.forEach(b => { initialCounts[b.id] = 0 })

    set({
      status: 'playing',
      unsortedItems: items,
      buckets,
      bucketCounts: initialCounts,
      elapsedSeconds: 0,
      sessionId: null,
    })
    startTimer()
    console.debug('[Game] started — items:', ITEM_COUNT_LOG, 'buckets:', buckets.length)

    try {
      const game = await apiService.createGame(items)
      set({ sessionId: game.id })
      console.debug('[Game] session created:', game.id)
    } catch (err) {
      console.debug('[Game] session create failed (offline):', err)
    }
  },

  handleDragEnd(event: DragEndEvent) {
    set(state => {
      const result = dragDropService.handleDragEnd(event, state.unsortedItems, state.buckets)
      if (!result) return state

      console.debug('[Game] drop result:', result.accepted ? 'accepted' : 'rejected')
      console.debug('[Game] state — unsorted:', result.updatedUnsorted.length)

      if (!result.accepted) return state

      const updatedUnsorted = result.updatedUnsorted
      const updatedCounts = {
        ...state.bucketCounts,
        [result.targetBucketId]: (state.bucketCounts[result.targetBucketId] ?? 0) + 1,
      }
      const isComplete = gameService.isComplete(updatedUnsorted)

      if (isComplete) {
        clearTimer()
        console.debug('[Game] complete! elapsed:', state.elapsedSeconds)
        void handleGameCompletion(state.elapsedSeconds)
      }

      return {
        unsortedItems: updatedUnsorted,
        bucketCounts: updatedCounts,
        status: isComplete ? 'complete' : state.status,
      }
    })
  },

  resetGame() {
    clearTimer()
    const items = gameService.generateItems()
    const buckets = gameService.generateBuckets()
    const initialCounts: Record<string, number> = {}
    buckets.forEach(b => { initialCounts[b.id] = 0 })

    set({
      status: 'playing',
      unsortedItems: items,
      buckets,
      bucketCounts: initialCounts,
      elapsedSeconds: 0,
      sessionId: null,
    })
    startTimer()
    console.debug('[Game] reset')

    void apiService.createGame(items)
      .then(game => useGameStore.setState({ sessionId: game.id }))
      .catch(err => console.debug('[Game] reset session create failed (offline):', err))
  },
}))

// Used only for the debug log above — avoids importing ITEM_COUNT directly in the store body
const ITEM_COUNT_LOG = 15

async function handleGameCompletion(elapsedSeconds: number): Promise<void> {
  const { sessionId, unsortedItems } = useGameStore.getState()
  const durationMs = elapsedSeconds * 1000

  if (sessionId !== null) {
    try {
      await apiService.completeGame(sessionId, durationMs, unsortedItems)
      console.debug('[Game] session completed:', sessionId)
    } catch (err) {
      console.debug('[Game] session complete failed (offline):', err)
    }
  }

  try {
    const result = await apiService.submitScore(durationMs)
    console.debug('[Game] score result:', result)
    if (result.accepted && result.score) {
      useGameStore.setState({ bestScore: Math.round(result.score.value / 1000) })
    }
  } catch (err) {
    console.debug('[Game] score submit failed (offline):', err)
  }
}

// Transition loading → idle
setTimeout(() => {
  useGameStore.setState({ status: 'idle' })
}, 600)
