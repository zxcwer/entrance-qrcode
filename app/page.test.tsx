import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Home from './page'

vi.mock('@/components/VisitorForm', () => ({
  default: ({
    onGenerate,
  }: {
    onGenerate: (v: string) => void
    onReset: () => void
  }) => (
    <button onClick={() => onGenerate('{"test":"data"}')}>mock-generate</button>
  ),
}))

vi.mock('@/components/PersonnelForm', () => ({
  default: ({
    onGenerate,
  }: {
    onGenerate: (v: string) => void
    onReset: () => void
  }) => (
    <button onClick={() => onGenerate('{"personnel":"data"}')}>mock-generate-personnel</button>
  ),
}))

vi.mock('@/components/QRDisplay', () => ({
  default: ({ value }: { value: string }) => (
    <div data-testid="qr-display" data-value={value} />
  ),
}))

describe('Home', () => {
  it('shows the form view with correct title initially', () => {
    render(<Home />)
    expect(screen.getByText('入場登録情報 QRコード発行')).toBeInTheDocument()
    expect(screen.queryByTestId('qr-display')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '← 戻る' })).not.toBeInTheDocument()
  })

  it('switches to QR view when form generates a payload', async () => {
    const user = userEvent.setup()
    render(<Home />)
    await user.click(screen.getByText('mock-generate'))
    expect(screen.getByText('QRコード')).toBeInTheDocument()
    expect(screen.getByTestId('qr-display')).toHaveAttribute(
      'data-value',
      '{"test":"data"}'
    )
    expect(screen.queryByText('入場登録情報 QRコード発行')).not.toBeInTheDocument()
  })

  it('shows the Back button on the QR view', async () => {
    const user = userEvent.setup()
    render(<Home />)
    await user.click(screen.getByText('mock-generate'))
    expect(screen.getByRole('button', { name: '← 戻る' })).toBeInTheDocument()
  })

  it('returns to form view and clears QR when Back is clicked', async () => {
    const user = userEvent.setup()
    render(<Home />)
    await user.click(screen.getByText('mock-generate'))
    await user.click(screen.getByRole('button', { name: '← 戻る' }))
    expect(screen.getByText('入場登録情報 QRコード発行')).toBeInTheDocument()
    expect(screen.queryByTestId('qr-display')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '← 戻る' })).not.toBeInTheDocument()
  })

  it('can generate a QR code again after returning to the form view', async () => {
    const user = userEvent.setup()
    render(<Home />)
    // first cycle
    await user.click(screen.getByText('mock-generate'))
    await user.click(screen.getByRole('button', { name: '← 戻る' }))
    // second cycle
    await user.click(screen.getByText('mock-generate'))
    expect(screen.getByText('QRコード')).toBeInTheDocument()
    expect(screen.getByTestId('qr-display')).toHaveAttribute('data-value', '{"test":"data"}')
  })

  it('switches to personnel form via hamburger menu', async () => {
    const user = userEvent.setup()
    render(<Home />)
    await user.click(screen.getByRole('button', { name: 'メニュー' }))
    await user.click(screen.getByText('入場受付'))
    expect(screen.getByText('入場受付 QRコード発行')).toBeInTheDocument()
    expect(screen.getByText('mock-generate-personnel')).toBeInTheDocument()
  })

  it('generates QR code from personnel form', async () => {
    const user = userEvent.setup()
    render(<Home />)
    await user.click(screen.getByRole('button', { name: 'メニュー' }))
    await user.click(screen.getByText('入場受付'))
    await user.click(screen.getByText('mock-generate-personnel'))
    expect(screen.getByText('QRコード')).toBeInTheDocument()
    expect(screen.getByTestId('qr-display')).toHaveAttribute('data-value', '{"personnel":"data"}')
  })

  it('switches back to visitor form via hamburger menu', async () => {
    const user = userEvent.setup()
    render(<Home />)
    await user.click(screen.getByRole('button', { name: 'メニュー' }))
    await user.click(screen.getByText('入場受付'))
    await user.click(screen.getByRole('button', { name: 'メニュー' }))
    await user.click(screen.getByText('入場登録情報'))
    expect(screen.getByText('入場登録情報 QRコード発行')).toBeInTheDocument()
    expect(screen.getByText('mock-generate')).toBeInTheDocument()
  })
})
