import { vi, describe, it, expect, beforeEach } from 'vitest'

const mockGetGame = vi.hoisted(() => vi.fn())

vi.mock('../services/ApiService', () => ({
  ApiService: vi.fn().mockImplementation(() => ({
    getBestScore: vi.fn().mockResolvedValue(null),
    createGame: vi.fn().mockResolvedValue({ id: 'test-session' }),
    completeGame: vi.fn().mockResolvedValue({ id: 'test-session' }),
    submitScore: vi.fn().mockResolvedValue({ accepted: false }),
    getGame: mockGetGame,
  })),
}))

vi.mock('../services/LocalStorageService', () => ({
  LocalStorageService: vi.fn().mockImplementation(() => ({
    save: vi.fn(),
    load: vi.fn().mockReturnValue(null),
    clear: vi.fn(),
  })),
}))

vi.mock('../services/GameService', () => ({
  GameService: vi.fn().mockImplementation(() => ({
    generateItems: vi.fn().mockReturnValue([]),
    generateBuckets: vi.fn().mockReturnValue([]),
    isComplete: vi.fn().mockReturnValue(false),
  })),
}))

vi.mock('../services/DragDropService', () => ({
  DragDropService: vi.fn().mockImplementation(() => ({
    handleDragEnd: vi.fn().mockReturnValue(null),
  })),
}))

import { useGameStore } from './useGameStore'
import type { ApiGame } from '../types/game.types'

const SAMPLE_GAME: ApiGame = {
  id: 'game-abc',
  items: [],
  durationMs: 8000,
  completed: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
}

describe('loadSharedGame', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useGameStore.setState({ sharedGame: null })
  })

  it('calls apiService.getGame with the provided session id', async () => {
    mockGetGame.mockResolvedValue(null)
    await useGameStore.getState().loadSharedGame('session-xyz')
    expect(mockGetGame).toHaveBeenCalledWith('session-xyz')
    expect(mockGetGame).toHaveBeenCalledTimes(1)
  })

  it('sets sharedGame in state when the API returns a completed game', async () => {
    mockGetGame.mockResolvedValue(SAMPLE_GAME)
    await useGameStore.getState().loadSharedGame('game-abc')
    expect(useGameStore.getState().sharedGame).toEqual(SAMPLE_GAME)
  })

  it('sets sharedGame to null when the API returns null (game not found)', async () => {
    useGameStore.setState({ sharedGame: SAMPLE_GAME })
    mockGetGame.mockResolvedValue(null)
    await useGameStore.getState().loadSharedGame('missing-id')
    expect(useGameStore.getState().sharedGame).toBeNull()
  })

  it('sets sharedGame to null when the API call throws', async () => {
    useGameStore.setState({ sharedGame: SAMPLE_GAME })
    mockGetGame.mockRejectedValue(new Error('Network error'))
    await useGameStore.getState().loadSharedGame('bad-id')
    expect(useGameStore.getState().sharedGame).toBeNull()
  })
})
