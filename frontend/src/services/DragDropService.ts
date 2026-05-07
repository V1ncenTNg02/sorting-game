import type { DragCancelEvent, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { ShapeItem } from '../domain/ShapeItem'
import { Bucket } from '../domain/Bucket'

export interface DropResult {
  accepted: boolean
  updatedUnsorted: ShapeItem[]
  targetBucketId: string
  droppedItem: ShapeItem
}

export class DragDropService {
  handleDragStart(event: DragStartEvent, unsortedItems: ShapeItem[]): void {
    const activeId = String(event.active.id)
    const item = unsortedItems.find(i => i.id === activeId)
    if (item) {
      console.debug('[DragDrop] drag started:', item.id, item.shape, item.colour)
    }
  }

  handleDragOver(event: DragOverEvent, unsortedItems: ShapeItem[], buckets: Bucket[]): void {
    const activeId = String(event.active.id)
    const item = unsortedItems.find(i => i.id === activeId)
    if (!item) return

    if (event.over) {
      const bucket = buckets.find(b => b.id === String(event.over!.id))
      if (bucket) {
        console.debug('[DragDrop] hovering over bucket:', bucket.id, bucket.label)
      }
    }
  }

  handleDragCancel(event: DragCancelEvent, unsortedItems: ShapeItem[]): void {
    const activeId = String(event.active.id)
    const item = unsortedItems.find(i => i.id === activeId)
    if (item) {
      console.debug('[DragDrop] drag cancelled:', item.id, item.shape, item.colour)
    }
  }

  handleDragEnd(
    event: DragEndEvent,
    unsortedItems: ShapeItem[],
    buckets: Bucket[]
  ): DropResult | null {
    if (!event.over) return null

    const activeId = String(event.active.id)
    const overId = String(event.over.id)

    const droppedItem = unsortedItems.find(item => item.id === activeId)
    if (!droppedItem) return null

    const targetBucket = buckets.find(b => b.id === overId)
    if (!targetBucket) return null

    const accepted = targetBucket.accepts(droppedItem)

    console.debug('[DragDrop] item:', droppedItem.id, droppedItem.shape, droppedItem.colour)
    console.debug('[DragDrop] target bucket:', targetBucket.id, '→ accepted:', accepted)

    return {
      accepted,
      updatedUnsorted: accepted
        ? unsortedItems.filter(item => item.id !== activeId)
        : unsortedItems,
      targetBucketId: overId,
      droppedItem,
    }
  }
}
