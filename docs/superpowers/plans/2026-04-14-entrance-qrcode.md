# Entrance QR Code Visitor Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive Next.js 15 web app where visitors self-register by filling in 8 fields, then receive a JSON-encoded QR code to show at the entrance gate.

**Architecture:** Single client-side page (App Router) with a `VisitorForm` component (React Hook Form) and a `QRDisplay` component (`qrcode.react`). No backend — all logic runs in the browser. Form data is serialized to JSON and passed as a prop to `QRDisplay`.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, React Hook Form, qrcode.react, Vitest + React Testing Library

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/layout.tsx` | Modify | Root layout, Japanese font (Noto Sans JP), page metadata |
| `app/globals.css` | Modify | Tailwind directives only |
| `app/page.tsx` | Create | Orchestrates form + QR display, holds `qrValue` state |
| `components/VisitorForm.tsx` | Create | 8-field form, validation, submit/reset callbacks |
| `components/QRDisplay.tsx` | Create | Renders QR code SVG; hidden when value is empty |
| `components/VisitorForm.test.tsx` | Create | Tests for form fields, disabled state, submit payload, reset |
| `components/QRDisplay.test.tsx` | Create | Tests for render/hide based on value |
| `vitest.config.ts` | Create | Vitest config with jsdom + path alias |
| `vitest.setup.ts` | Create | Imports `@testing-library/jest-dom` |

---

## Task 1: Scaffold Next.js project and install dependencies

**Files:**
- Create: `package.json` (via scaffold)
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Scaffold Next.js app**

Run in the project root (`entrance-qrcode/`):

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes
```

Expected: Scaffold completes, `package.json`, `app/`, `tailwind.config.ts`, `tsconfig.json` etc. are created.

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install react-hook-form qrcode.react
```

Expected: Both packages appear in `package.json` under `"dependencies"`.

- [ ] **Step 3: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Expected: All packages appear under `"devDependencies"`.

- [ ] **Step 4: Add test scripts to package.json**

Open `package.json` and add to the `"scripts"` section:

```json
"test": "vitest",
"test:run": "vitest run"
```

The scripts section should look like:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest",
  "test:run": "vitest run"
}
```

- [ ] **Step 5: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 6: Create `vitest.setup.ts`**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 7: Update `tsconfig.json` to include Vitest globals**

In `tsconfig.json`, add `"vitest/globals"` to the `compilerOptions.types` array. If `types` doesn't exist, add it:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

Merge into the existing `compilerOptions` — do not replace the entire file.

- [ ] **Step 8: Verify Vitest runs**

```bash
npm run test:run
```

Expected: `No test files found, exiting with code 0` (or similar — no errors, just no tests yet).

- [ ] **Step 9: Commit**

```bash
git init
git add .
git commit -m "chore: scaffold Next.js project with Vitest and dependencies"
```

---

## Task 2: Build QRDisplay component (TDD)

**Files:**
- Create: `components/QRDisplay.test.tsx`
- Create: `components/QRDisplay.tsx`

- [ ] **Step 1: Create the test file**

Create `components/QRDisplay.test.tsx`:

```tsx
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
      screen.getByText('QRコードを顔情報登録画面でご提示ください')
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- components/QRDisplay.test.tsx
```

Expected: FAIL — `Cannot find module './QRDisplay'`

- [ ] **Step 3: Create `components/QRDisplay.tsx`**

```tsx
'use client'
import { QRCodeSVG } from 'qrcode.react'

interface QRDisplayProps {
  value: string
}

export default function QRDisplay({ value }: QRDisplayProps) {
  if (!value) return null

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-medium text-gray-500">
        QRコードを顔情報登録画面でご提示ください
      </p>
      <QRCodeSVG value={value} size={256} />
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- components/QRDisplay.test.tsx
```

Expected: PASS — 3 tests pass

- [ ] **Step 5: Commit**

```bash
git add components/QRDisplay.tsx components/QRDisplay.test.tsx
git commit -m "feat: add QRDisplay component"
```

---

## Task 3: Build VisitorForm component (TDD)

**Files:**
- Create: `components/VisitorForm.test.tsx`
- Create: `components/VisitorForm.tsx`

- [ ] **Step 1: Create the test file**

Create `components/VisitorForm.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import VisitorForm from './VisitorForm'

const fillAllFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('姓'), 'ほげほげ')
  await user.type(screen.getByLabelText('名'), 'ぼげぼげ')
  await user.type(screen.getByLabelText('姓（カナ）'), 'ほげほげ')
  await user.type(screen.getByLabelText('名（カナ）'), 'ぼげぼげ')
  await user.type(screen.getByLabelText('会社名'), 'ABC Company')
  await user.type(screen.getByLabelText('部署'), 'DX AI')
  await user.type(screen.getByLabelText('電話番号'), '123456789')
  await user.type(screen.getByLabelText('車両番号'), '1234')
}

describe('VisitorForm', () => {
  it('renders all 8 required fields', () => {
    render(<VisitorForm onGenerate={vi.fn()} onReset={vi.fn()} />)
    expect(screen.getByLabelText('姓')).toBeInTheDocument()
    expect(screen.getByLabelText('名')).toBeInTheDocument()
    expect(screen.getByLabelText('姓（カナ）')).toBeInTheDocument()
    expect(screen.getByLabelText('名（カナ）')).toBeInTheDocument()
    expect(screen.getByLabelText('会社名')).toBeInTheDocument()
    expect(screen.getByLabelText('部署')).toBeInTheDocument()
    expect(screen.getByLabelText('電話番号')).toBeInTheDocument()
    expect(screen.getByLabelText('車両番号')).toBeInTheDocument()
  })

  it('disables the submit button when the form is empty', () => {
    render(<VisitorForm onGenerate={vi.fn()} onReset={vi.fn()} />)
    expect(
      screen.getByRole('button', { name: 'QRコードを生成' })
    ).toBeDisabled()
  })

  it('enables the submit button when all fields are filled', async () => {
    const user = userEvent.setup()
    render(<VisitorForm onGenerate={vi.fn()} onReset={vi.fn()} />)
    await fillAllFields(user)
    expect(
      screen.getByRole('button', { name: 'QRコードを生成' })
    ).toBeEnabled()
  })

  it('calls onGenerate with a JSON string of all field values on submit', async () => {
    const user = userEvent.setup()
    const onGenerate = vi.fn()
    render(<VisitorForm onGenerate={onGenerate} onReset={vi.fn()} />)
    await fillAllFields(user)
    await user.click(screen.getByRole('button', { name: 'QRコードを生成' }))
    expect(onGenerate).toHaveBeenCalledWith(
      JSON.stringify({
        lastname: 'ほげほげ',
        firstname: 'ぼげぼげ',
        lastnameKana: 'ほげほげ',
        firstnameKana: 'ぼげぼげ',
        company: 'ABC Company',
        department: 'DX AI',
        phone: '123456789',
        vehicleNumber: '1234',
      })
    )
  })

  it('calls onReset and clears all fields when Reset is clicked', async () => {
    const user = userEvent.setup()
    const onReset = vi.fn()
    render(<VisitorForm onGenerate={vi.fn()} onReset={onReset} />)
    await fillAllFields(user)
    await user.click(screen.getByRole('button', { name: 'リセット' }))
    expect(onReset).toHaveBeenCalled()
    expect(screen.getByLabelText('姓')).toHaveValue('')
    expect(screen.getByLabelText('会社名')).toHaveValue('')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run -- components/VisitorForm.test.tsx
```

Expected: FAIL — `Cannot find module './VisitorForm'`

- [ ] **Step 3: Create `components/VisitorForm.tsx`**

```tsx
'use client'
import { useForm } from 'react-hook-form'

type VisitorFormData = {
  lastname: string
  firstname: string
  lastnameKana: string
  firstnameKana: string
  company: string
  department: string
  phone: string
  vehicleNumber: string
}

interface VisitorFormProps {
  onGenerate: (jsonPayload: string) => void
  onReset: () => void
}

const FIELDS: { name: keyof VisitorFormData; label: string }[] = [
  { name: 'lastname', label: '姓' },
  { name: 'firstname', label: '名' },
  { name: 'lastnameKana', label: '姓（カナ）' },
  { name: 'firstnameKana', label: '名（カナ）' },
  { name: 'company', label: '会社名' },
  { name: 'department', label: '部署' },
  { name: 'phone', label: '電話番号' },
  { name: 'vehicleNumber', label: '車両番号' },
]

export default function VisitorForm({ onGenerate, onReset }: VisitorFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<VisitorFormData>({ mode: 'onChange' })

  const onSubmit = (data: VisitorFormData) => {
    onGenerate(JSON.stringify(data))
  }

  const handleReset = () => {
    reset()
    onReset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {FIELDS.map(({ name, label }) => (
        <div key={name} className="flex flex-col gap-1">
          <label
            htmlFor={name}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
          <input
            id={name}
            {...register(name, { required: true })}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={!isValid}
        className="mt-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        QRコードを生成
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        リセット
      </button>
    </form>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- components/VisitorForm.test.tsx
```

Expected: PASS — 5 tests pass

- [ ] **Step 5: Commit**

```bash
git add components/VisitorForm.tsx components/VisitorForm.test.tsx
git commit -m "feat: add VisitorForm component"
```

---

## Task 4: Wire up page.tsx and layout

**Files:**
- Create: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace `app/page.tsx`**

Delete the scaffold content and replace with:

```tsx
'use client'
import { useState } from 'react'
import VisitorForm from '@/components/VisitorForm'
import QRDisplay from '@/components/QRDisplay'

export default function Home() {
  const [qrValue, setQrValue] = useState('')

  return (
    <main className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md flex flex-col gap-6">
        <h1 className="text-center text-xl font-bold text-gray-800">
          入場受付 QRコード発行
        </h1>
        <VisitorForm
          onGenerate={setQrValue}
          onReset={() => setQrValue('')}
        />
        <QRDisplay value={qrValue} />
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
})

export const metadata: Metadata = {
  title: '入場受付 QRコード発行',
  description: '入場用QRコードを発行するアプリケーションです',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Replace `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: Run all tests**

```bash
npm run test:run
```

Expected: PASS — all 8 tests pass (3 QRDisplay + 5 VisitorForm)

- [ ] **Step 5: Verify the app runs in the browser**

```bash
npm run dev
```

Open `http://localhost:3000` in a browser. Verify:
- Page shows title "入場受付 QRコード発行"
- All 8 labeled fields are visible
- "QRコードを生成" button is greyed out
- Filling all fields enables the button
- Clicking "QRコードを生成" shows the QR code below the form
- Clicking "リセット" clears the form and hides the QR code
- On a mobile viewport (375px wide), layout is single-column and usable

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/layout.tsx app/globals.css
git commit -m "feat: wire up page with VisitorForm and QRDisplay"
```
