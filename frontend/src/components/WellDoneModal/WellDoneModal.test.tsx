import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WellDoneModal } from './WellDoneModal'

describe('WellDoneModal', () => {
  it('displays the elapsed time', () => {
    render(<WellDoneModal elapsedSeconds={95} bestScore={null} onReset={vi.fn()} />)
    expect(screen.getByText('01:35')).toBeInTheDocument()
  })

  it('calls onReset when Play Again is clicked', async () => {
    const onReset = vi.fn()
    render(<WellDoneModal elapsedSeconds={0} bestScore={null} onReset={onReset} />)
    await userEvent.click(screen.getByRole('button', { name: /play again/i }))
    expect(onReset).toHaveBeenCalledOnce()
  })

  it('shows a well done heading', () => {
    render(<WellDoneModal elapsedSeconds={0} bestScore={null} onReset={vi.fn()} />)
    expect(screen.getByRole('heading', { name: /well done/i })).toBeInTheDocument()
  })

  it('hides best score section when bestScore is null', () => {
    render(<WellDoneModal elapsedSeconds={60} bestScore={null} onReset={vi.fn()} />)
    expect(screen.queryByText('Best Score')).not.toBeInTheDocument()
  })

  it('renders the best score time when bestScore is provided', () => {
    render(<WellDoneModal elapsedSeconds={60} bestScore={120} onReset={vi.fn()} />)
    expect(screen.getByText('Best Score')).toBeInTheDocument()
    expect(screen.getByText('02:00')).toBeInTheDocument()
  })

  it('shows New best! when elapsedSeconds is less than bestScore', () => {
    render(<WellDoneModal elapsedSeconds={45} bestScore={120} onReset={vi.fn()} />)
    expect(screen.getByText('New best!')).toBeInTheDocument()
  })

  it('hides New best! when elapsedSeconds equals bestScore', () => {
    render(<WellDoneModal elapsedSeconds={120} bestScore={120} onReset={vi.fn()} />)
    expect(screen.queryByText('New best!')).not.toBeInTheDocument()
  })

  it('hides New best! when elapsedSeconds is greater than bestScore', () => {
    render(<WellDoneModal elapsedSeconds={180} bestScore={120} onReset={vi.fn()} />)
    expect(screen.queryByText('New best!')).not.toBeInTheDocument()
  })
})
