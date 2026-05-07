import { describe, it, expect } from 'vitest'
import { Bucket } from './Bucket'
import { ShapeItem } from './ShapeItem'

describe('Bucket', () => {
  const bucket = new Bucket('bucket-red-triangle', 'triangle', 'red', 'Red Triangle')

  it('stores id, shape, colour, and label', () => {
    expect(bucket.id).toBe('bucket-red-triangle')
    expect(bucket.shape).toBe('triangle')
    expect(bucket.colour).toBe('red')
    expect(bucket.label).toBe('Red Triangle')
  })

  describe('accepts', () => {
    it('accepts an item with matching shape and colour', () => {
      const item = new ShapeItem('item-1', 'triangle', 'red')
      expect(bucket.accepts(item)).toBe(true)
    })

    it('rejects an item with matching colour but wrong shape', () => {
      const item = new ShapeItem('item-1', 'square', 'red')
      expect(bucket.accepts(item)).toBe(false)
    })

    it('rejects an item with matching shape but wrong colour', () => {
      const item = new ShapeItem('item-1', 'triangle', 'blue')
      expect(bucket.accepts(item)).toBe(false)
    })

    it('rejects an item with neither matching', () => {
      const item = new ShapeItem('item-1', 'circle', 'green')
      expect(bucket.accepts(item)).toBe(false)
    })
  })
})
