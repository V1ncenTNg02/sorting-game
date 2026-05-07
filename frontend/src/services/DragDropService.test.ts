import { describe, it, expect, vi } from 'vitest'
import { DragDropService } from './DragDropService'
import { ShapeItem } from '../domain/ShapeItem'
import { Bucket } from '../domain/Bucket'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

function makeStartEvent(activeId: string): DragStartEvent {
  return {
    active: { id: activeId, data: { current: undefined }, rect: { current: { initial: null, translated: null } } },
    activatorEvent: new PointerEvent('pointerdown'),
    collisions: [],
    delta: { x: 0, y: 0 },
  } as unknown as DragStartEvent
}

function makeEvent(activeId: string, overId: string | null): DragEndEvent {
  return {
    active: { id: activeId, data: { current: undefined }, rect: { current: { initial: null, translated: null } } },
    over: overId ? { id: overId, data: { current: undefined }, rect: { width: 0, height: 0, top: 0, left: 0, bottom: 0, right: 0 } } : null,
    activatorEvent: new PointerEvent('pointerdown'),
    collisions: [],
    delta: { x: 0, y: 0 },
  } as unknown as DragEndEvent
}

describe('DragDropService', () => {
  const service = new DragDropService()

  const redTriangle = new ShapeItem('item-1', 'triangle', 'red')
  const blueSquare  = new ShapeItem('item-2', 'square', 'blue')
  const items = [redTriangle, blueSquare]

  const buckets = [
    new Bucket('bucket-red-triangle', 'triangle', 'red', 'Red Triangle'),
    new Bucket('bucket-blue-square',  'square',   'blue', 'Blue Square'),
  ]

  describe('handleDragStart', () => {
    it('logs the item when drag begins on a known item', () => {
      const spy = vi.spyOn(console, 'debug').mockImplementation(() => {})
      service.handleDragStart(makeStartEvent('item-1'), items)
      expect(spy).toHaveBeenCalledWith('[DragDrop] drag started:', 'item-1', 'triangle', 'red')
      spy.mockRestore()
    })

    it('does not log when the active id is not in unsorted items', () => {
      const spy = vi.spyOn(console, 'debug').mockImplementation(() => {})
      service.handleDragStart(makeStartEvent('item-99'), items)
      expect(spy).not.toHaveBeenCalled()
      spy.mockRestore()
    })
  })

  it('returns null when dropped outside any bucket', () => {
    expect(service.handleDragEnd(makeEvent('item-1', null), items, buckets)).toBeNull()
  })

  it('returns null when active item is not in unsorted list', () => {
    expect(service.handleDragEnd(makeEvent('item-99', 'bucket-red-triangle'), items, buckets)).toBeNull()
  })

  it('returns null when dropped on an unrecognised bucket id', () => {
    expect(service.handleDragEnd(makeEvent('item-1', 'bucket-unknown'), items, buckets)).toBeNull()
  })

  describe('correct drop', () => {
    it('accepted is true', () => {
      const result = service.handleDragEnd(makeEvent('item-1', 'bucket-red-triangle'), items, buckets)
      expect(result!.accepted).toBe(true)
    })

    it('removes the item from updatedUnsorted', () => {
      const result = service.handleDragEnd(makeEvent('item-1', 'bucket-red-triangle'), items, buckets)
      expect(result!.updatedUnsorted.find(i => i.id === 'item-1')).toBeUndefined()
    })

    it('sets droppedItem and targetBucketId', () => {
      const result = service.handleDragEnd(makeEvent('item-1', 'bucket-red-triangle'), items, buckets)
      expect(result!.droppedItem.id).toBe('item-1')
      expect(result!.targetBucketId).toBe('bucket-red-triangle')
    })
  })

  describe('wrong drop', () => {
    it('accepted is false', () => {
      // red triangle dropped on blue-square bucket
      const result = service.handleDragEnd(makeEvent('item-1', 'bucket-blue-square'), items, buckets)
      expect(result!.accepted).toBe(false)
    })

    it('leaves updatedUnsorted unchanged', () => {
      const result = service.handleDragEnd(makeEvent('item-1', 'bucket-blue-square'), items, buckets)
      expect(result!.updatedUnsorted).toHaveLength(items.length)
      expect(result!.updatedUnsorted.find(i => i.id === 'item-1')).toBeDefined()
    })
  })
})
