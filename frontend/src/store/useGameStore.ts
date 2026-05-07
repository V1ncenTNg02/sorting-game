import { create } from 'zustand'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { ShapeItem } from '../domain/ShapeItem'
import { Bucket } from '../domain/Bucket'
import { GameService } from '../services/GameService'
import { DragDropService } from '../services/DragDropService'
import { ApiService } from '../services/ApiService'
import { LocalStorageService } from '../services/LocalStorageService'
import type { IApiService } from '../services/ApiService'
import type { ILocalStorageService } from '../services/LocalStorageService'
import type { ApiGame, GameStatus } from '../types/game.types'

interface GameStore {
  status: GameStatus
  unsortedItems: ShapeItem[]
  buckets: Bucket[]
  bucketCounts: Record<string, number>
  elapsedSeconds: number
  sessionId: string | null
  bestScore: number | null
  sharedGame: ApiGame | null
  loadBestScore(): Promise<void>
  startGame(): Promise<void>
  handleDragStart(event: DragStartEvent): void
  handleDragEnd(event: DragEndEvent): void
  resetGame(): void
  loadSharedGame(id: string): Promise<void>
}

const gameService = new GameService()
const dragDropService = new DragDropService()
const apiService: IApiService = new ApiService()
const localStorageService: ILocalStorageService = new LocalStorageService()

let timerInterval: ReturnType<typeof setInterval> | null = null

const TIMER_SAVE_INTERVAL_TICKS = 10

function clearTimer(): void {
  if (timerInterval !== null) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function startTimer(): void {
  clearTimer()
  let tickCount = 0
  timerInterval = setInterval(() => {
    tickCount += 1
    useGameStore.setState(s =>
      s.status === 'playing' ? { elapsedSeconds: s.elapsedSeconds + 1 } : {}
    )
    if (tickCount % TIMER_SAVE_INTERVAL_TICKS === 0) {
      const s = useGameStore.getState()
      if (s.status === 'playing') {
        localStorageService.save({
          status: 'playing',
          unsortedItems: s.unsortedItems,
          bucketCounts: s.bucketCounts,
          elapsedSeconds: s.elapsedSeconds,
          sessionId: s.sessionId,
        })
      }
    }
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
  sharedGame: null,

  async loadBestScore() {
    const score = await apiService.getBestScore()
    const bestScore = score !== null ? Math.round(score.value / 1000) : null
    set({ bestScore })
    console.debug('[Game] best score loaded:', bestScore)
  },

  async startGame() {
    localStorageService.clear()
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
      sharedGame: null,
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

  handleDragStart(event: DragStartEvent) {
    dragDropService.handleDragStart(event, useGameStore.getState().unsortedItems)
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
        localStorageService.clear()
        console.debug('[Game] complete! elapsed:', state.elapsedSeconds)
        void handleGameCompletion(state.elapsedSeconds)
      } else {
        localStorageService.save({
          status: 'playing',
          unsortedItems: updatedUnsorted,
          bucketCounts: updatedCounts,
          elapsedSeconds: state.elapsedSeconds,
          sessionId: state.sessionId,
        })
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
    localStorageService.clear()
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
      sharedGame: null,
    })
    startTimer()
    console.debug('[Game] reset')

    void apiService.createGame(items)
      .then(game => useGameStore.setState({ sessionId: game.id }))
      .catch(err => console.debug('[Game] reset session create failed (offline):', err))
  },

  async loadSharedGame(id: string) {
    try {
      const game = await apiService.getGame(id)
      set({ sharedGame: game })
      console.debug('[Game] shared game loaded:', game?.id ?? 'not found')
    } catch (err) {
      console.debug('[Game] shared game load failed:', err)
      set({ sharedGame: null })
    }
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

// Transition loading → idle, or restore a saved in-progress game
setTimeout(() => {
  const saved = localStorageService.load()
  if (saved) {
    const buckets = gameService.generateBuckets()
    useGameStore.setState({
      status: 'playing',
      unsortedItems: saved.unsortedItems,
      buckets,
      bucketCounts: saved.bucketCounts,
      elapsedSeconds: saved.elapsedSeconds,
      sessionId: saved.sessionId,
    })
    startTimer()
    console.debug('[Game] restored from localStorage, elapsed:', saved.elapsedSeconds)
  } else {
    useGameStore.setState({ status: 'idle' })
  }
}, 600)
