import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TopBar } from './TopBar'

describe('TopBar', () => {
  it('displays the formatted elapsed time', () => {
    render(<TopBar elapsed={95} itemsLeft={10} onReset={vi.fn()} />)
    expect(screen.getByLabelText('elapsed time')).toHaveTextContent('01:35')
  })

  it('displays the items left count', () => {
    render(<TopBar elapsed={0} itemsLeft={7} onReset={vi.fn()} />)
    expect(screen.getByLabelText('items left')).toHaveTextContent('7')
  })

  it('calls onReset when Reset is clicked', async () => {
    const onReset = vi.fn()
    render(<TopBar elapsed={0} itemsLeft={15} onReset={onReset} />)
    await userEvent.click(screen.getByRole('button', { name: /reset/i }))
    expect(onReset).toHaveBeenCalledOnce()
  })
})
