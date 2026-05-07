import { create } from 'zustand'
import type { DragEndEvent } from '@dnd-kit/core'
import { ShapeItem } from '../domain/ShapeItem'
import { Bucket } from '../domain/Bucket'
import { GameService } from '../services/GameService'
import { DragDropService } from '../services/DragDropService'
import type { GameStatus } from '../types/game.types'

interface GameStore {
  status: GameStatus
  unsortedItems: ShapeItem[]
  buckets: Bucket[]
  bucketCounts: Record<string, number>
  elapsedSeconds: number
  startGame(): void
  handleDragEnd(event: DragEndEvent): void
  resetGame(): void
}

const gameService = new GameService()
const dragDropService = new DragDropService()

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

  startGame() {
    const buckets = gameService.generateBuckets()
    const initialCounts: Record<string, number> = {}
    buckets.forEach(b => { initialCounts[b.id] = 0 })

    set({
      status: 'playing',
      unsortedItems: gameService.generateItems(),
      buckets,
      bucketCounts: initialCounts,
      elapsedSeconds: 0,
    })
    startTimer()
    console.debug('[Game] started — items:', ITEM_COUNT_LOG, 'buckets:', buckets.length)
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
    const buckets = gameService.generateBuckets()
    const initialCounts: Record<string, number> = {}
    buckets.forEach(b => { initialCounts[b.id] = 0 })

    set({
      status: 'playing',
      unsortedItems: gameService.generateItems(),
      buckets,
      bucketCounts: initialCounts,
      elapsedSeconds: 0,
    })
    startTimer()
    console.debug('[Game] reset')
  },
}))

// Used only for the debug log above — avoids importing ITEM_COUNT directly in the store body
const ITEM_COUNT_LOG = 15

// Transition loading → idle
setTimeout(() => {
  useGameStore.setState({ status: 'idle' })
}, 600)
