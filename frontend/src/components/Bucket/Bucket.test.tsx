// BucketZone is superseded by SidebarTarget — these tests now cover SidebarTarget instead.
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SidebarTarget } from '../SidebarTarget/SidebarTarget'
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

describe('BucketZone (via SidebarTarget)', () => {
  const bucket = new Bucket('bucket-blue-circle', 'circle', 'blue', 'Blue Circle')

  it('displays the bucket label', () => {
    render(<SidebarTarget bucket={bucket} count={0} />)
    expect(screen.getByText('Blue Circle')).toBeInTheDocument()
  })

  it('displays the count badge', () => {
    render(<SidebarTarget bucket={bucket} count={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('applies highlight when isOver', () => {
    mockUseDroppable.mockReturnValueOnce({ ...defaultDroppable, isOver: true })
    const { container } = render(<SidebarTarget bucket={bucket} count={0} />)
    expect(container.firstChild).toHaveClass('ring-1')
  })
})
