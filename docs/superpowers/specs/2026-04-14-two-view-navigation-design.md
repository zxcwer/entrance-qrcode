# Two-View Navigation (Form → QR) — Design Spec

**Date:** 2026-04-14  
**Status:** Approved

---

## Overview

Refactor `app/page.tsx` to separate the form and QR code into two distinct views. When the visitor taps "QRコードを生成", the app transitions to a QR-only screen. A "← 戻る" button on the QR screen returns the visitor to the blank form.

No routing changes. No component changes. Only `app/page.tsx` is modified.

---

## Architecture

**Single file change:** `app/page.tsx` only.

`VisitorForm` and `QRDisplay` are unchanged — they already have the right interfaces.

Two state variables:
- `view: 'form' | 'qr'` — controls which screen is rendered
- `qrValue: string` — the JSON payload passed to QRDisplay

---

## View: Form (`view === 'form'`)

- Card with title "入場受付 QRコード発行"
- Renders `<VisitorForm>`
  - `onGenerate`: sets `qrValue` to the JSON payload, sets `view` to `'qr'`
  - `onReset`: no-op (`() => {}`) — reset is handled by the Back button on the QR screen
- No QRDisplay rendered

## View: QR (`view === 'qr'`)

- Card with title "QRコード"
- Renders `<QRDisplay value={qrValue} />`
- A "← 戻る" button below the QR code
  - Tapping it sets `view` back to `'form'` and clears `qrValue` to `''`

---

## Data Flow

```
Initial state: view='form', qrValue=''

Generate tapped:
  setQrValue(jsonPayload)
  setView('qr')

Back tapped:
  setView('form')
  setQrValue('')
```

---

## Out of Scope

- Routing / URL changes
- Animations between views
- Changes to VisitorForm or QRDisplay components
- Persisting form values when navigating back (form resets to blank)
