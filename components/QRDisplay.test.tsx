import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach } from 'vitest'
import QRDisplay from './QRDisplay'

vi.mock('qrcode.react', () => ({
  QRCodeCanvas: ({ value }: { value: string }) => (
    <canvas data-testid="qr-code" data-value={value} />
  ),
}))

afterEach(() => {
  vi.restoreAllMocks()
})

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
      screen.getByText('QRコードを顔情報登録画面でご提示ください')
    ).toBeInTheDocument()
  })

  it('shows the save button when value is provided', () => {
    render(<QRDisplay value='{"lastname":"test"}' />)
    expect(
      screen.getByRole('button', { name: '画像を保存' })
    ).toBeInTheDocument()
  })

  it('does not show the save button when value is empty', () => {
    render(<QRDisplay value="" />)
    expect(
      screen.queryByRole('button', { name: '画像を保存' })
    ).not.toBeInTheDocument()
  })

  it('calls toDataURL and triggers download when save button is clicked', async () => {
    const user = userEvent.setup()
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
      'data:image/png;base64,mock'
    )
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {})
    const appendSpy = vi.spyOn(document.body, 'appendChild')

    render(<QRDisplay value='{"lastname":"test"}' />)
    await user.click(screen.getByRole('button', { name: '画像を保存' }))

    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledWith('image/png')
    expect(clickSpy).toHaveBeenCalled()
    const anchorCall = appendSpy.mock.calls.find(
      ([node]) => node instanceof HTMLAnchorElement
    )
    const anchor = anchorCall![0] as HTMLAnchorElement
    expect(anchor.download).toBe('qrcode.png')
  })
})
