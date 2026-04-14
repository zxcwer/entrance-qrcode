# Two-View Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `app/page.tsx` so Generate switches to a QR-only screen and "← 戻る" returns to the blank form.

**Architecture:** Add a `view: 'form' | 'qr'` state to `page.tsx`. Conditionally render either the form view (title + VisitorForm) or the QR view (title + QRDisplay + Back button). No routing, no component changes.

**Tech Stack:** Next.js 15+ App Router, React useState, Vitest + React Testing Library

---

## File Map

| File | Action |
|---|---|
| `app/page.tsx` | Modify — add `view` state, split into two conditional renders |
| `app/page.test.tsx` | Create — tests for form→QR transition, QR→form back navigation |

---

## Task 1: Add two-view navigation to page.tsx (TDD)

**Files:**
- Create: `app/page.test.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `app/page.test.tsx`**

```tsx
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

vi.mock('@/components/QRDisplay', () => ({
  default: ({ value }: { value: string }) => (
    <div data-testid="qr-display" data-value={value} />
  ),
}))

describe('Home', () => {
  it('shows the form view with correct title initially', () => {
    render(<Home />)
    expect(screen.getByText('入場受付 QRコード発行')).toBeInTheDocument()
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
    expect(screen.queryByText('入場受付 QRコード発行')).not.toBeInTheDocument()
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
    expect(screen.getByText('入場受付 QRコード発行')).toBeInTheDocument()
    expect(screen.queryByTestId('qr-display')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '← 戻る' })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- app/page.test.tsx
```

Expected: FAIL — tests fail because `page.tsx` currently renders both form and QR simultaneously (no view switching).

- [ ] **Step 3: Replace `app/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import VisitorForm from '@/components/VisitorForm'
import QRDisplay from '@/components/QRDisplay'

type View = 'form' | 'qr'

export default function Home() {
  const [view, setView] = useState<View>('form')
  const [qrValue, setQrValue] = useState('')

  const handleGenerate = (json: string) => {
    setQrValue(json)
    setView('qr')
  }

  const handleBack = () => {
    setView('form')
    setQrValue('')
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md flex flex-col gap-6">
        {view === 'form' ? (
          <>
            <h1 className="text-center text-xl font-bold text-gray-800">
              入場受付 QRコード発行
            </h1>
            <VisitorForm onGenerate={handleGenerate} onReset={() => {}} />
          </>
        ) : (
          <>
            <h1 className="text-center text-xl font-bold text-gray-800">
              QRコード
            </h1>
            <QRDisplay value={qrValue} />
            <button
              type="button"
              onClick={handleBack}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              ← 戻る
            </button>
          </>
        )}
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Run all tests to verify they pass**

```bash
npm run test:run
```

Expected: PASS — all 12 tests pass (4 new page tests + 3 QRDisplay + 5 VisitorForm)

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/page.test.tsx
git commit -m "feat: separate form and QR code into two views with Back navigation"
```
