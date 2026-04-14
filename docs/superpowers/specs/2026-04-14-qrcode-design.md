# QR Code Visitor Entrance Pass — Design Spec

**Date:** 2026-04-14  
**Status:** Approved

---

## Overview

A Next.js web application that allows visitors to self-register before arriving at a facility. The visitor fills in their information, and a QR code encoding that data as JSON is generated on-screen. The visitor shows the QR code at the gate, where a separate application scans it and auto-fills an entry form.

---

## Architecture

**Stack:**
- Next.js 15 (App Router)
- `qrcode.react` — client-side QR code rendering as SVG
- Tailwind CSS — responsive styling
- React Hook Form — form state and validation

**No backend required.** No API routes, no database, no authentication. Everything runs client-side.

**Project structure:**
```
app/
  page.tsx           ← single page: form + QR reveal
  layout.tsx         ← global layout and fonts
components/
  VisitorForm.tsx    ← controlled form with all 8 fields
  QRDisplay.tsx      ← renders QR code from JSON payload
```

---

## Data

The QR code encodes the following 8 fields as a compact JSON string (`JSON.stringify`):

| Field | Japanese Label | Required |
|---|---|---|
| `lastname` | 姓 | Yes |
| `firstname` | 名 | Yes |
| `lastnameKana` | 姓（カナ） | Yes |
| `firstnameKana` | 名（カナ） | Yes |
| `company` | 会社名 | Yes |
| `department` | 部署 | Yes |
| `phone` | 電話番号 | Yes |
| `vehicleNumber` | 車両番号 | Yes |

**Example payload:**
```json
{"lastname":"ほげほげ","firstname":"ぼげぼげ","lastnameKana":"ほげほげ","firstnameKana":"ぼげぼげ","company":"ABC Company","department":"DX AI","phone":"123456789","vehicleNumber":"1234"}
```

---

## UI Layout

**Single-page, Option A:** Form and QR code on one page. No navigation.

**Mobile (single column, full width):**
- App title at top
- 8 labeled input fields stacked vertically
- "Generate QR" primary button
- QR code (256px SVG) appears below the button after submit
- "Reset" button appears below the QR code

**PC (centered card):**
- Same layout centered on screen in a card container (max-width ~480px)
- White card on light grey background

**Visual style:**
- White card, light grey page background
- Labels above each input
- Primary button: blue/indigo, full width
- QR code centered with subtle fade-in animation on reveal
- "Reset" button clears the form and hides the QR code

---

## Behavior

- All 8 fields are required; the "Generate QR" button is disabled until all fields are filled
- On submit, the JSON payload is assembled and passed to `QRDisplay`
- The QR code fades in below the form — no page navigation
- "Reset" clears all fields and hides the QR code
- Stateless — no data is persisted anywhere (no localStorage, no backend)

---

## Out of Scope

- Download / share QR code
- Backend storage of visitor records
- Authentication or admin interface
- Multi-language support beyond Japanese labels
