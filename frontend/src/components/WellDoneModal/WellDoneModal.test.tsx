import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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

  it('renders a custom resetLabel', () => {
    render(<WellDoneModal elapsedSeconds={60} bestScore={null} onReset={vi.fn()} resetLabel="Play Game" />)
    expect(screen.getByRole('button', { name: /play game/i })).toBeInTheDocument()
  })

  describe('isShared', () => {
    it('shows "Shared Result" heading when isShared is true', () => {
      render(<WellDoneModal elapsedSeconds={60} bestScore={null} onReset={vi.fn()} isShared />)
      expect(screen.getByRole('heading', { name: /shared result/i })).toBeInTheDocument()
    })

    it('shows "Well Done!" heading when isShared is false', () => {
      render(<WellDoneModal elapsedSeconds={60} bestScore={null} onReset={vi.fn()} />)
      expect(screen.getByRole('heading', { name: /well done/i })).toBeInTheDocument()
    })

    it('shows friend message when isShared is true', () => {
      render(<WellDoneModal elapsedSeconds={60} bestScore={null} onReset={vi.fn()} isShared />)
      expect(screen.getByText(/your friend sorted everything in/i)).toBeInTheDocument()
    })

    it('shows own message when isShared is false', () => {
      render(<WellDoneModal elapsedSeconds={60} bestScore={null} onReset={vi.fn()} />)
      expect(screen.getByText(/you sorted everything in/i)).toBeInTheDocument()
    })

    it('hides Share button when isShared is true even if sessionId is provided', () => {
      render(<WellDoneModal elapsedSeconds={60} bestScore={null} sessionId="uuid-123" onReset={vi.fn()} isShared />)
      expect(screen.queryByRole('button', { name: /share/i })).not.toBeInTheDocument()
    })
  })

  describe('Share button', () => {
    let writeText: ReturnType<typeof vi.fn>

    beforeEach(() => {
      writeText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        writable: true,
        configurable: true,
      })
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('shows a Share button when sessionId is provided', () => {
      render(<WellDoneModal elapsedSeconds={60} bestScore={null} sessionId="uuid-123" onReset={vi.fn()} />)
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
    })

    it('does not show a Share button when sessionId is omitted', () => {
      render(<WellDoneModal elapsedSeconds={60} bestScore={null} onReset={vi.fn()} />)
      expect(screen.queryByRole('button', { name: /share/i })).not.toBeInTheDocument()
    })

    it('does not show a Share button when sessionId is null', () => {
      render(<WellDoneModal elapsedSeconds={60} bestScore={null} sessionId={null} onReset={vi.fn()} />)
      expect(screen.queryByRole('button', { name: /share/i })).not.toBeInTheDocument()
    })

    it('copies a URL containing the sessionId to clipboard on click', async () => {
      render(<WellDoneModal elapsedSeconds={60} bestScore={null} sessionId="uuid-abc" onReset={vi.fn()} />)
      await userEvent.click(screen.getByRole('button', { name: /share/i }))
      expect(writeText).toHaveBeenCalledWith(expect.stringContaining('session=uuid-abc'))
    })

    it('shows Copied! after clicking Share', async () => {
      render(<WellDoneModal elapsedSeconds={60} bestScore={null} sessionId="uuid-abc" onReset={vi.fn()} />)
      await userEvent.click(screen.getByRole('button', { name: /share/i }))
      expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument()
    })
  })
})
