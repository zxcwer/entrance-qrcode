# Save QR Code as PNG — Design Spec

**Date:** 2026-04-14  
**Status:** Approved

---

## Overview

Add a "画像を保存" button to the QR code view that downloads the displayed QR code as a PNG file (`qrcode.png`). No new dependencies required — `qrcode.react` already exports `QRCodeCanvas`.

---

## Architecture

**One file changes: `components/QRDisplay.tsx`**

`app/page.tsx` and `components/VisitorForm.tsx` are untouched.

---

## Changes to `QRDisplay.tsx`

1. Replace `QRCodeSVG` import with `QRCodeCanvas` from `qrcode.react`
2. Add `useRef<HTMLCanvasElement>` — attach to the canvas element via `QRCodeCanvas`'s `ref` prop
3. Add `handleSave` function:
   - Read the canvas element from the ref
   - Call `canvas.toDataURL('image/png')` to get the PNG data URL
   - Create a temporary `<a>` element with `href` set to the data URL and `download="qrcode.png"`
   - Programmatically click it to trigger browser download
   - Remove the temporary element
4. Add "画像を保存" button below the QR code canvas

---

## UI Layout (QR view)

```
[QR code canvas - 256×256px]
[画像を保存]    ← new secondary button inside QRDisplay
```

Followed by (in page.tsx, unchanged):
```
[← 戻る]
```

---

## Downloaded File

- Filename: `qrcode.png`
- Format: PNG
- Size: 256×256px (matches the canvas render size)

---

## Out of Scope

- Custom filename
- Custom image size / high-DPI export
- Share sheet on mobile (Web Share API)
- Other formats (SVG, JPEG)
