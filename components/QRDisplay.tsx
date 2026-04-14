'use client'
import { QRCodeSVG } from 'qrcode.react'

interface QRDisplayProps {
  value: string
}

export default function QRDisplay({ value }: QRDisplayProps) {
  if (!value) return null

  return (
    <div className="flex flex-col items-center gap-4 animate-[fade-in]">
      <p className="text-sm font-medium text-gray-500">
        QRコードを入口でご提示ください
      </p>
      <QRCodeSVG value={value} size={256} />
    </div>
  )
}
