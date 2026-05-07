import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameBoard } from './GameBoard'
import { ShapeItem } from '../../domain/ShapeItem'
import { Bucket } from '../../domain/Bucket'

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  }),
  useDroppable: () => ({ setNodeRef: vi.fn(), isOver: false }),
}))

describe('GameBoard', () => {
  const items = [new ShapeItem('item-1', 'circle', 'red', { x: 20, y: 20 })]
  const buckets = [
    new Bucket('bucket-red-circle', 'circle', 'red', 'Red Circle'),
    new Bucket('bucket-blue-square', 'square', 'blue', 'Blue Square'),
  ]
  const bucketCounts = { 'bucket-red-circle': 0, 'bucket-blue-square': 2 }

  it('renders the board heading', () => {
    render(
      <GameBoard
        unsortedItems={items}
        buckets={buckets}
        bucketCounts={bucketCounts}
        elapsedSeconds={0}
        onDragEnd={vi.fn()}
        onReset={vi.fn()}
      />
    )
    expect(screen.getByText('Unsorted Items')).toBeInTheDocument()
  })

  it('renders bucket labels in the sidebar', () => {
    render(
      <GameBoard
        unsortedItems={items}
        buckets={buckets}
        bucketCounts={bucketCounts}
        elapsedSeconds={0}
        onDragEnd={vi.fn()}
        onReset={vi.fn()}
      />
    )
    expect(screen.getByText('Red Circle')).toBeInTheDocument()
    expect(screen.getByText('Blue Square')).toBeInTheDocument()
  })

  it('renders the unsorted item on the board', () => {
    render(
      <GameBoard
        unsortedItems={items}
        buckets={buckets}
        bucketCounts={bucketCounts}
        elapsedSeconds={0}
        onDragEnd={vi.fn()}
        onReset={vi.fn()}
      />
    )
    // The icon appears in both the sidebar and on the board — confirm at least one is present
    expect(screen.getAllByLabelText('red circle').length).toBeGreaterThan(0)
  })
})
