import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UnsortedArea } from './UnsortedArea'
import { ShapeItem } from '../../domain/ShapeItem'

vi.mock('@dnd-kit/core', () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    isDragging: false,
  }),
}))

describe('UnsortedArea', () => {
  const items = [
    new ShapeItem('item-1', 'circle', 'red',   { x: 10, y: 10 }),
    new ShapeItem('item-2', 'square', 'blue',  { x: 40, y: 40 }),
    new ShapeItem('item-3', 'triangle', 'green', { x: 70, y: 70 }),
  ]

  it('renders all draggable items', () => {
    render(<UnsortedArea items={items} />)
    expect(screen.getByLabelText('red circle')).toBeInTheDocument()
    expect(screen.getByLabelText('blue square')).toBeInTheDocument()
    expect(screen.getByLabelText('green triangle')).toBeInTheDocument()
  })

  it('renders empty state when no items remain', () => {
    render(<UnsortedArea items={[]} />)
    expect(screen.getByText(/all sorted/i)).toBeInTheDocument()
  })
})
