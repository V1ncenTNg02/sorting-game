import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageService } from './LocalStorageService'
import { ShapeItem } from '../domain/ShapeItem'
import type { PersistedGameState } from './LocalStorageService'

const STORAGE_KEY = 'sorting-game:state'

describe('LocalStorageService', () => {
  let service: LocalStorageService

  beforeEach(() => {
    service = new LocalStorageService()
    localStorage.clear()
  })

  describe('save', () => {
    it('writes the state to localStorage under the correct key', () => {
      const state: PersistedGameState = {
        status: 'playing',
        unsortedItems: [new ShapeItem('a', 'triangle', 'red', { x: 10, y: 20 })],
        bucketCounts: { 'bucket-1': 2 },
        elapsedSeconds: 42,
        sessionId: 'session-uuid',
      }
      service.save(state)
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
    })

    it('serialises elapsedSeconds and sessionId correctly', () => {
      const state: PersistedGameState = {
        status: 'playing',
        unsortedItems: [],
        bucketCounts: {},
        elapsedSeconds: 99,
        sessionId: 'my-session',
      }
      service.save(state)
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
      expect(parsed.elapsedSeconds).toBe(99)
      expect(parsed.sessionId).toBe('my-session')
    })
  })

  describe('load', () => {
    it('returns null when nothing is stored', () => {
      expect(service.load()).toBeNull()
    })

    it('returns null for corrupt JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{')
      expect(service.load()).toBeNull()
    })

    it('returns null when status is not playing', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: 'complete' }))
      expect(service.load()).toBeNull()
    })

    it('reconstructs ShapeItem class instances with correct fields', () => {
      const state: PersistedGameState = {
        status: 'playing',
        unsortedItems: [new ShapeItem('x', 'circle', 'blue', { x: 5, y: 7 })],
        bucketCounts: {},
        elapsedSeconds: 10,
        sessionId: null,
      }
      service.save(state)
      const loaded = service.load()
      expect(loaded).not.toBeNull()
      const item = loaded!.unsortedItems[0]
      expect(item).toBeInstanceOf(ShapeItem)
      expect(item.id).toBe('x')
      expect(item.shape).toBe('circle')
      expect(item.colour).toBe('blue')
      expect(item.position).toEqual({ x: 5, y: 7 })
    })

    it('reconstructed ShapeItem has working matchesBucket method', () => {
      const state: PersistedGameState = {
        status: 'playing',
        unsortedItems: [new ShapeItem('y', 'square', 'red', { x: 0, y: 0 })],
        bucketCounts: {},
        elapsedSeconds: 5,
        sessionId: null,
      }
      service.save(state)
      const loaded = service.load()!
      const item = loaded.unsortedItems[0]
      expect(item.matchesBucket('square', 'red')).toBe(true)
      expect(item.matchesBucket('triangle', 'red')).toBe(false)
    })

    it('preserves bucketCounts, elapsedSeconds, and sessionId on round-trip', () => {
      const state: PersistedGameState = {
        status: 'playing',
        unsortedItems: [],
        bucketCounts: { 'b-1': 3, 'b-2': 1 },
        elapsedSeconds: 77,
        sessionId: 'uuid-abc',
      }
      service.save(state)
      const loaded = service.load()!
      expect(loaded.bucketCounts).toEqual({ 'b-1': 3, 'b-2': 1 })
      expect(loaded.elapsedSeconds).toBe(77)
      expect(loaded.sessionId).toBe('uuid-abc')
    })

    it('returns status playing on a valid round-trip', () => {
      const state: PersistedGameState = {
        status: 'playing',
        unsortedItems: [],
        bucketCounts: {},
        elapsedSeconds: 0,
        sessionId: null,
      }
      service.save(state)
      expect(service.load()!.status).toBe('playing')
    })
  })

  describe('clear', () => {
    it('removes the stored state so load returns null', () => {
      service.save({ status: 'playing', unsortedItems: [], bucketCounts: {}, elapsedSeconds: 5, sessionId: null })
      service.clear()
      expect(service.load()).toBeNull()
    })

    it('is safe to call when nothing is stored', () => {
      expect(() => service.clear()).not.toThrow()
    })
  })
})
