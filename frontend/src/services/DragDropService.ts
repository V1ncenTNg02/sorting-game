import type { DragEndEvent } from '@dnd-kit/core'
import { ShapeItem } from '../domain/ShapeItem'
import { Bucket } from '../domain/Bucket'

export interface DropResult {
  accepted: boolean
  updatedUnsorted: ShapeItem[]
  targetBucketId: string
  droppedItem: ShapeItem
}

export class DragDropService {
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
