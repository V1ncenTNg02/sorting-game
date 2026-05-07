import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { ApiGame } from './types/game.types'

vi.mock('./store/useGameStore', () => ({
  useGameStore: vi.fn(),
}))

vi.mock('./components/GameBoard/GameBoard', () => ({
  GameBoard: () => <div data-testid="game-board" />,
}))

vi.mock('./components/LoadingScreen/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen" />,
}))

import App from './App'
import { useGameStore } from './store/useGameStore'

const loadBestScore = vi.fn().mockResolvedValue(undefined)
const loadSharedGame = vi.fn().mockResolvedValue(undefined)
const startGame = vi.fn().mockResolvedValue(undefined)
const resetGame = vi.fn()
const handleDragStart = vi.fn()
const handleDragEnd = vi.fn()

type StoreOverrides = Partial<{
  status: string
  unsortedItems: unknown[]
  buckets: unknown[]
  bucketCounts: Record<string, number>
  elapsedSeconds: number
  sessionId: string | null
  bestScore: number | null
  sharedGame: ApiGame | null
}>

function setupStore(overrides: StoreOverrides = {}) {
  const state = {
    status: 'idle',
    unsortedItems: [],
    buckets: [],
    bucketCounts: {},
    elapsedSeconds: 0,
    sessionId: null,
    bestScore: null,
    sharedGame: null,
    loadBestScore,
    startGame,
    handleDragStart,
    handleDragEnd,
    resetGame,
    loadSharedGame,
    ...overrides,
  }
  vi.mocked(useGameStore).mockImplementation(
    (selector: unknown) => (selector as (s: typeof state) => unknown)(state),
  )
}

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    writable: true,
    configurable: true,
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('App — status transitions', () => {
  it('renders loading screen when status is loading', () => {
    setupStore({ status: 'loading' })
    render(<App />)
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument()
  })

  it('renders Start Game button when status is idle', () => {
    setupStore({ status: 'idle' })
    render(<App />)
    expect(screen.getByRole('button', { name: /start game/i })).toBeInTheDocument()
  })

  it('renders GameBoard when status is playing', () => {
    setupStore({ status: 'playing' })
    render(<App />)
    expect(screen.getByTestId('game-board')).toBeInTheDocument()
  })

  it('shows Well Done modal with elapsed time when status is complete', () => {
    setupStore({ status: 'complete', elapsedSeconds: 42 })
    render(<App />)
    expect(screen.getByText(/well done/i)).toBeInTheDocument()
    expect(screen.getByText('00:42')).toBeInTheDocument()
  })

  it('calls resetGame when Play Again button is clicked in completion modal', async () => {
    setupStore({ status: 'complete', elapsedSeconds: 10 })
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /play again/i }))
    expect(resetGame).toHaveBeenCalledTimes(1)
  })
})

describe('App — sharing link', () => {
  it('calls loadSharedGame with session id from URL query param on mount', async () => {
    vi.stubGlobal('location', { search: '?session=shared-game-abc', origin: 'http://localhost:5173' })
    setupStore()
    render(<App />)
    await waitFor(() => expect(loadSharedGame).toHaveBeenCalledWith('shared-game-abc'))
  })

  it('does not call loadSharedGame when no session param is present in the URL', () => {
    vi.stubGlobal('location', { search: '', origin: 'http://localhost:5173' })
    setupStore()
    render(<App />)
    expect(loadSharedGame).not.toHaveBeenCalled()
  })

  it('renders Well Done modal with shared game duration when sharedGame is completed', () => {
    vi.stubGlobal('location', { search: '?session=shared-abc', origin: 'http://localhost:5173' })
    const sharedGame: ApiGame = {
      id: 'shared-abc',
      items: [],
      durationMs: 30000,
      completed: true,
      createdAt: '',
      updatedAt: '',
    }
    setupStore({ status: 'playing', sharedGame })
    render(<App />)
    expect(screen.getByText(/well done/i)).toBeInTheDocument()
    expect(screen.getByText('00:30')).toBeInTheDocument()
  })

  it('renders shared Well Done modal even when app status is idle', () => {
    vi.stubGlobal('location', { search: '?session=shared-abc', origin: 'http://localhost:5173' })
    const sharedGame: ApiGame = {
      id: 'shared-abc',
      items: [],
      durationMs: 28000,
      completed: true,
      createdAt: '',
      updatedAt: '',
    }
    setupStore({ status: 'idle', sharedGame })
    render(<App />)
    expect(screen.getByText(/well done/i)).toBeInTheDocument()
    expect(screen.getByText('00:28')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /start game/i })).not.toBeInTheDocument()
  })

  it('calls startGame when Play Game button is clicked in the shared Well Done modal', async () => {
    vi.stubGlobal('location', { search: '?session=shared-abc', origin: 'http://localhost:5173' })
    const sharedGame: ApiGame = {
      id: 'shared-abc',
      items: [],
      durationMs: 15000,
      completed: true,
      createdAt: '',
      updatedAt: '',
    }
    setupStore({ status: 'playing', sharedGame })
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: /play game/i }))
    expect(startGame).toHaveBeenCalledTimes(1)
  })

  it('does not show Well Done modal when sharedGame exists but is not completed', () => {
    const sharedGame: ApiGame = {
      id: 'in-progress',
      items: [],
      durationMs: null,
      completed: false,
      createdAt: '',
      updatedAt: '',
    }
    setupStore({ status: 'playing', sharedGame })
    render(<App />)
    expect(screen.queryByText(/well done/i)).not.toBeInTheDocument()
  })
})
