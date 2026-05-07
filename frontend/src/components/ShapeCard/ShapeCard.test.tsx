import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ShapeCard } from './ShapeCard'
import { ShapeItem } from '../../domain/ShapeItem'
import * as dndCore from '@dnd-kit/core'

const mockUseDraggable = vi.spyOn(dndCore, 'useDraggable')

const defaultDraggable = {
  attributes: {},
  listeners: undefined,
  setNodeRef: vi.fn(),
  transform: null,
  isDragging: false,
} as any

beforeEach(() => {
  mockUseDraggable.mockReturnValue(defaultDraggable)
})

describe('ShapeCard', () => {
  const item = new ShapeItem('item-1', 'circle', 'red', { x: 25, y: 50 })

  it('renders the shape svg with correct aria-label', () => {
    render(<ShapeCard item={item} />)
    expect(screen.getByLabelText('red circle')).toBeInTheDocument()
  })

  it('positions the card at the item percentage coordinates', () => {
    const { container } = render(<ShapeCard item={item} />)
    const card = container.firstChild as HTMLElement
    expect(card.style.left).toBe('25%')
    expect(card.style.top).toBe('50%')
  })

  it('applies reduced opacity when dragging', () => {
    mockUseDraggable.mockReturnValueOnce({ ...defaultDraggable, isDragging: true })
    const { container } = render(<ShapeCard item={item} />)
    expect(container.firstChild).toHaveClass('opacity-40')
  })
})
