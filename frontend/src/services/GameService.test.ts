import { describe, it, expect, beforeEach } from 'vitest'
import { GameService } from './GameService'
import { ITEM_COUNT, SHAPES, COLOURS, BUCKET_DEFINITIONS } from '../constants/game.constants'

describe('GameService', () => {
  let service: GameService

  beforeEach(() => {
    service = new GameService()
  })

  describe('generateItems', () => {
    it(`generates exactly ${ITEM_COUNT} items`, () => {
      expect(service.generateItems()).toHaveLength(ITEM_COUNT)
    })

    it('assigns unique ids to every item', () => {
      const items = service.generateItems()
      const ids = new Set(items.map(i => i.id))
      expect(ids.size).toBe(ITEM_COUNT)
    })

    it('only uses valid shapes', () => {
      const items = service.generateItems()
      items.forEach(i => expect(SHAPES).toContain(i.shape))
    })

    it('only uses valid colours', () => {
      const items = service.generateItems()
      items.forEach(i => expect(COLOURS).toContain(i.colour))
    })

    it('assigns a position to every item', () => {
      const items = service.generateItems()
      items.forEach(i => {
        expect(typeof i.position.x).toBe('number')
        expect(typeof i.position.y).toBe('number')
      })
    })
  })

  describe('generateBuckets', () => {
    it(`generates ${BUCKET_DEFINITIONS.length} buckets`, () => {
      expect(service.generateBuckets()).toHaveLength(BUCKET_DEFINITIONS.length)
    })

    it('all buckets have unique ids', () => {
      const buckets = service.generateBuckets()
      const ids = new Set(buckets.map(b => b.id))
      expect(ids.size).toBe(BUCKET_DEFINITIONS.length)
    })

    it('each bucket has a valid shape and colour', () => {
      const buckets = service.generateBuckets()
      buckets.forEach(b => {
        expect(SHAPES).toContain(b.shape)
        expect(COLOURS).toContain(b.colour)
      })
    })

    it('each bucket has a non-empty label', () => {
      const buckets = service.generateBuckets()
      buckets.forEach(b => expect(b.label.length).toBeGreaterThan(0))
    })
  })

  describe('isComplete', () => {
    it('returns true when unsorted list is empty', () => {
      expect(service.isComplete([])).toBe(true)
    })

    it('returns false when unsorted list has items', () => {
      const items = service.generateItems()
      expect(service.isComplete(items)).toBe(false)
    })
  })
})
