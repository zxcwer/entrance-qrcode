# Save QR Code as PNG Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "画像を保存" button to the QR code view that downloads the displayed QR code as `qrcode.png`.

**Architecture:** Swap `QRCodeSVG` for `QRCodeCanvas` in `QRDisplay.tsx`, wrap it in a div with a ref, and use `querySelector('canvas')` + `toDataURL('image/png')` to trigger a browser download. No new dependencies.

**Tech Stack:** qrcode.react (`QRCodeCanvas`), React `useRef`, browser Canvas API, Vitest + React Testing Library

---

## File Map

| File | Action |
|---|---|
| `components/QRDisplay.tsx` | Modify — swap to QRCodeCanvas, add container ref, save handler, save button |
| `components/QRDisplay.test.tsx` | Modify — update mock to QRCodeCanvas, add 2 new tests |

---

## Task 1: Add save-as-PNG to QRDisplay (TDD)

**Files:**
- Modify: `components/QRDisplay.test.tsx`
- Modify: `components/QRDisplay.tsx`

- [ ] **Step 1: Update the test file**

Replace the entire content of `components/QRDisplay.test.tsx` with:

```tsx
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

    render(<QRDisplay value='{"lastname":"test"}' />)
    await user.click(screen.getByRole('button', { name: '画像を保存' }))

    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledWith('image/png')
    expect(clickSpy).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run tests to verify the new ones fail**

```bash
npm run test:run -- components/QRDisplay.test.tsx
```

Expected: The 3 original tests pass, the 3 new tests FAIL (component has no save button yet).

- [ ] **Step 3: Replace `components/QRDisplay.tsx`**

```tsx
'use client'
import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

interface QRDisplayProps {
  value: string
}

export default function QRDisplay({ value }: QRDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSave = () => {
    const canvas = containerRef.current?.querySelector<HTMLCanvasElement>('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = 'qrcode.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!value) return null

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-4 animate-[fade-in]">
      <p className="text-sm font-medium text-gray-500">
        QRコードを顔情報登録画面でご提示ください
      </p>
      <QRCodeCanvas value={value} size={256} />
      <button
        type="button"
        onClick={handleSave}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        画像を保存
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Run all tests to verify they pass**

```bash
npm run test:run
```

Expected: PASS — all 16 tests pass (6 QRDisplay + 5 VisitorForm + 5 page)

- [ ] **Step 5: Commit**

```bash
git add components/QRDisplay.tsx components/QRDisplay.test.tsx
git commit -m "feat: add save as PNG button to QR code view"
```
