import { describe, it, expect } from 'vitest'
import { ShapeItem } from './ShapeItem'

describe('ShapeItem', () => {
  it('stores id, shape, and colour', () => {
    const item = new ShapeItem('item-1', 'triangle', 'red')
    expect(item.id).toBe('item-1')
    expect(item.shape).toBe('triangle')
    expect(item.colour).toBe('red')
  })

  it('defaults position to { x: 0, y: 0 }', () => {
    const item = new ShapeItem('item-1', 'triangle', 'red')
    expect(item.position).toEqual({ x: 0, y: 0 })
  })

  it('stores a custom position', () => {
    const item = new ShapeItem('item-1', 'triangle', 'red', { x: 30, y: 60 })
    expect(item.position).toEqual({ x: 30, y: 60 })
  })

  describe('matchesColourBucket', () => {
    it('returns true when colour matches', () => {
      const item = new ShapeItem('item-1', 'circle', 'blue')
      expect(item.matchesColourBucket('blue')).toBe(true)
    })

    it('returns false when colour does not match', () => {
      const item = new ShapeItem('item-1', 'circle', 'blue')
      expect(item.matchesColourBucket('red')).toBe(false)
    })
  })

  describe('matchesShapeBucket', () => {
    it('returns true when shape matches', () => {
      const item = new ShapeItem('item-1', 'square', 'green')
      expect(item.matchesShapeBucket('square')).toBe(true)
    })

    it('returns false when shape does not match', () => {
      const item = new ShapeItem('item-1', 'square', 'green')
      expect(item.matchesShapeBucket('circle')).toBe(false)
    })
  })

  describe('matchesBucket', () => {
    it('returns true when both shape and colour match', () => {
      const item = new ShapeItem('item-1', 'triangle', 'red')
      expect(item.matchesBucket('triangle', 'red')).toBe(true)
    })

    it('returns false when shape does not match', () => {
      const item = new ShapeItem('item-1', 'triangle', 'red')
      expect(item.matchesBucket('square', 'red')).toBe(false)
    })

    it('returns false when colour does not match', () => {
      const item = new ShapeItem('item-1', 'triangle', 'red')
      expect(item.matchesBucket('triangle', 'blue')).toBe(false)
    })
  })
})
