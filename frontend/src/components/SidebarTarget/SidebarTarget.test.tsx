import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SidebarTarget } from './SidebarTarget'
import { Bucket } from '../../domain/Bucket'
import * as dndCore from '@dnd-kit/core'

const mockUseDroppable = vi.spyOn(dndCore, 'useDroppable')

const defaultDroppable = {
  setNodeRef: vi.fn(),
  isOver: false,
  over: null,
  active: null,
  rect: null,
} as any

beforeEach(() => {
  mockUseDroppable.mockReturnValue(defaultDroppable)
})

describe('SidebarTarget', () => {
  const bucket = new Bucket('bucket-red-triangle', 'triangle', 'red', 'Red Triangle')

  it('displays the bucket label', () => {
    render(<SidebarTarget bucket={bucket} count={0} />)
    expect(screen.getByText('Red Triangle')).toBeInTheDocument()
  })

  it('displays the count badge', () => {
    render(<SidebarTarget bucket={bucket} count={4} />)
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('applies highlight styling when isOver', () => {
    mockUseDroppable.mockReturnValueOnce({ ...defaultDroppable, isOver: true })
    const { container } = render(<SidebarTarget bucket={bucket} count={0} />)
    expect(container.firstChild).toHaveClass('ring-1')
  })
})
