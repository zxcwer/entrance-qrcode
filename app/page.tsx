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
        <div hidden={view === 'qr'}>
          <h1 className="text-center text-xl font-bold text-gray-800">
            入場受付 QRコード発行
          </h1>
          <VisitorForm onGenerate={handleGenerate} onReset={() => {}} />
        </div>
        {view === 'qr' && (
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
