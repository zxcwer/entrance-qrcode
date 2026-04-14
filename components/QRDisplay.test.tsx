import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import QRDisplay from './QRDisplay'

vi.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value }: { value: string }) => (
    <div data-testid="qr-code" data-value={value} />
  ),
}))

describe('QRDisplay', () => {
  it('renders the QR code when value is a non-empty string', () => {
    render(<QRDisplay value='{"lastname":"test"}' />)
    expect(screen.getByTestId('qr-code')).toBeInTheDocument()
    expect(screen.getByTestId('qr-code')).toHaveAttribute(
      'data-value',
      '{"lastname":"test"}'
    )
  })

  it('renders nothing when value is an empty string', () => {
    render(<QRDisplay value="" />)
    expect(screen.queryByTestId('qr-code')).not.toBeInTheDocument()
  })

  it('shows the instruction text when value is provided', () => {
    render(<QRDisplay value='{"lastname":"test"}' />)
    expect(
      screen.getByText('QRコードを入口でご提示ください')
    ).toBeInTheDocument()
  })
})
