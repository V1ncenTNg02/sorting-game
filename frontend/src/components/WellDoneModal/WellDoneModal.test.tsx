import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WellDoneModal } from './WellDoneModal'

describe('WellDoneModal', () => {
  it('displays the elapsed time', () => {
    render(<WellDoneModal elapsedSeconds={95} onReset={vi.fn()} />)
    expect(screen.getByText('01:35')).toBeInTheDocument()
  })

  it('calls onReset when Play Again is clicked', async () => {
    const onReset = vi.fn()
    render(<WellDoneModal elapsedSeconds={0} onReset={onReset} />)
    await userEvent.click(screen.getByRole('button', { name: /play again/i }))
    expect(onReset).toHaveBeenCalledOnce()
  })

  it('shows a well done heading', () => {
    render(<WellDoneModal elapsedSeconds={0} onReset={vi.fn()} />)
    expect(screen.getByRole('heading', { name: /well done/i })).toBeInTheDocument()
  })
})
