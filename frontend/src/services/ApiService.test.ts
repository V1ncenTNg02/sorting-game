import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ApiService } from './ApiService'
import { ShapeItem } from '../domain/ShapeItem'
import type { ApiScore, ApiGame } from '../types/game.types'

function mockFetchResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  }
}

describe('ApiService', () => {
  let service: ApiService
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    service = new ApiService()
    fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('getBestScore', () => {
    it('returns ApiScore on 200', async () => {
      const score: ApiScore = { id: 1, value: 45000, recordedAt: '2024-01-01T00:00:00Z' }
      fetchMock.mockResolvedValueOnce(mockFetchResponse(200, score))

      const result = await service.getBestScore()

      expect(result).toEqual(score)
      expect(fetchMock).toHaveBeenCalledWith('/api/best-score')
    })

    it('returns null on 404', async () => {
      fetchMock.mockResolvedValueOnce(mockFetchResponse(404, { error: 'No score recorded yet' }))

      const result = await service.getBestScore()

      expect(result).toBeNull()
    })

    it('returns null on network error', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))

      const result = await service.getBestScore()

      expect(result).toBeNull()
    })

    it('returns null on 500 server error', async () => {
      fetchMock.mockResolvedValueOnce(mockFetchResponse(500, { error: 'Internal server error' }))

      const result = await service.getBestScore()

      expect(result).toBeNull()
    })
  })

  describe('createGame', () => {
    const items = [
      new ShapeItem('item-0', 'triangle', 'red', { x: 10, y: 20 }),
      new ShapeItem('item-1', 'circle', 'blue', { x: 30, y: 40 }),
    ]

    it('POSTs to /api/games with serialised items', async () => {
      const game: ApiGame = {
        id: 'uuid-123',
        items: [],
        durationMs: null,
        completed: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }
      fetchMock.mockResolvedValueOnce(mockFetchResponse(201, game))

      await service.createGame(items)

      expect(fetchMock).toHaveBeenCalledWith('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            { id: 'item-0', shape: 'triangle', colour: 'red', position: { x: 10, y: 20 } },
            { id: 'item-1', shape: 'circle', colour: 'blue', position: { x: 30, y: 40 } },
          ],
        }),
      })
    })

    it('returns ApiGame on 201', async () => {
      const game: ApiGame = {
        id: 'uuid-123',
        items: [],
        durationMs: null,
        completed: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }
      fetchMock.mockResolvedValueOnce(mockFetchResponse(201, game))

      const result = await service.createGame(items)

      expect(result).toEqual(game)
    })

    it('throws on non-2xx response', async () => {
      fetchMock.mockResolvedValueOnce(mockFetchResponse(400, { error: 'Bad request' }))

      await expect(service.createGame(items)).rejects.toThrow()
    })

    it('maps ShapeItem class instances to plain ApiGameItem objects', async () => {
      const game: ApiGame = {
        id: 'uuid-xyz',
        items: [],
        durationMs: null,
        completed: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }
      fetchMock.mockResolvedValueOnce(mockFetchResponse(201, game))

      await service.createGame(items)

      const callBody = JSON.parse(fetchMock.mock.calls[0][1].body)
      const firstItem = callBody.items[0]
      // Should only have plain data fields, no class methods
      expect(Object.keys(firstItem).sort()).toEqual(['colour', 'id', 'position', 'shape'].sort())
    })
  })

  describe('completeGame', () => {
    const gameId = 'uuid-abc'
    const durationMs = 60000
    const items = [new ShapeItem('item-0', 'square', 'green', { x: 5, y: 5 })]

    it('PATCHes /api/games/:id with duration_ms, completed, and items', async () => {
      const game: ApiGame = {
        id: gameId,
        items: [],
        durationMs,
        completed: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }
      fetchMock.mockResolvedValueOnce(mockFetchResponse(200, game))

      await service.completeGame(gameId, durationMs, items)

      expect(fetchMock).toHaveBeenCalledWith(`/api/games/${gameId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration_ms: durationMs,
          completed: true,
          items: [{ id: 'item-0', shape: 'square', colour: 'green', position: { x: 5, y: 5 } }],
        }),
      })
    })

    it('returns ApiGame on 200', async () => {
      const game: ApiGame = {
        id: gameId,
        items: [],
        durationMs,
        completed: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }
      fetchMock.mockResolvedValueOnce(mockFetchResponse(200, game))

      const result = await service.completeGame(gameId, durationMs, items)

      expect(result).toEqual(game)
    })

    it('throws on non-2xx response', async () => {
      fetchMock.mockResolvedValueOnce(mockFetchResponse(404, { error: 'Game not found' }))

      await expect(service.completeGame(gameId, durationMs, items)).rejects.toThrow()
    })
  })

  describe('submitScore', () => {
    it('returns accepted result with score when backend accepts', async () => {
      const score: ApiScore = { id: 2, value: 30000, recordedAt: '2024-01-01T00:00:00Z' }
      fetchMock.mockResolvedValueOnce(mockFetchResponse(200, { accepted: true, score }))

      const result = await service.submitScore(30000)

      expect(result.accepted).toBe(true)
      if (result.accepted) {
        expect(result.score).toEqual(score)
      }
    })

    it('returns rejected result with reason when backend rejects', async () => {
      fetchMock.mockResolvedValueOnce(
        mockFetchResponse(200, { accepted: false, reason: 'Score is not lower than the current best' })
      )

      const result = await service.submitScore(99000)

      expect(result.accepted).toBe(false)
      if (!result.accepted) {
        expect(result.reason).toBe('Score is not lower than the current best')
      }
    })

    it('throws on non-2xx response', async () => {
      fetchMock.mockResolvedValueOnce(mockFetchResponse(400, { error: 'Validation failed' }))

      await expect(service.submitScore(-1)).rejects.toThrow()
    })

    it('POSTs to /api/best-score with the value', async () => {
      const score: ApiScore = { id: 3, value: 20000, recordedAt: '2024-01-01T00:00:00Z' }
      fetchMock.mockResolvedValueOnce(mockFetchResponse(200, { accepted: true, score }))

      await service.submitScore(20000)

      expect(fetchMock).toHaveBeenCalledWith('/api/best-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 20000 }),
      })
    })
  })

  describe('getGame', () => {
    const game: ApiGame = {
      id: 'game-uuid',
      items: [],
      durationMs: 45000,
      completed: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }

    it('GETs /api/games/:id and returns ApiGame on 200', async () => {
      fetchMock.mockResolvedValueOnce(mockFetchResponse(200, game))

      const result = await service.getGame('game-uuid')

      expect(result).toEqual(game)
      expect(fetchMock).toHaveBeenCalledWith('/api/games/game-uuid')
    })

    it('returns null on 404', async () => {
      fetchMock.mockResolvedValueOnce(mockFetchResponse(404, { error: 'Not found' }))

      const result = await service.getGame('missing-id')

      expect(result).toBeNull()
    })

    it('throws on non-2xx non-404 response', async () => {
      fetchMock.mockResolvedValueOnce(mockFetchResponse(500, { error: 'Server error' }))

      await expect(service.getGame('game-uuid')).rejects.toThrow()
    })
  })
})
