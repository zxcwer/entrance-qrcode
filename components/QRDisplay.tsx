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
    const padding = 20
    const offscreen = document.createElement('canvas')
    offscreen.width = canvas.width + padding * 2
    offscreen.height = canvas.height + padding * 2
    const ctx = offscreen.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, offscreen.width, offscreen.height)
    ctx.drawImage(canvas, padding, padding)
    const url = offscreen.toDataURL('image/png')
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
