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
