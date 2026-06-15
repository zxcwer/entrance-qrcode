'use client'
import { useState } from 'react'
import VisitorForm from '@/components/VisitorForm'
import PersonnelForm from '@/components/PersonnelForm'
import QRDisplay from '@/components/QRDisplay'

type Page = 'visitor' | 'personnel'
type View = 'form' | 'qr'

export default function Home() {
  const [page, setPage] = useState<Page>('visitor')
  const [view, setView] = useState<View>('form')
  const [qrValue, setQrValue] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleGenerate = (json: string) => {
    setQrValue(json)
    setView('qr')
    setMenuOpen(false)
  }

  const handleBack = () => {
    setView('form')
    setQrValue('')
  }

  const handlePageSwitch = (newPage: Page) => {
    setPage(newPage)
    setView('form')
    setQrValue('')
    setMenuOpen(false)
  }

  const title =
    view === 'qr'
      ? 'QRコード'
      : page === 'visitor'
        ? '顔登録用のQR作成'
        : '入場用のQR作成'

  return (
    <main className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md flex flex-col gap-6">
        <div className="relative flex items-center">
          <h1 className="flex-1 text-center text-xl font-bold text-gray-800">{title}</h1>
          <div className="relative">
            <button
              type="button"
              aria-label="メニュー"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex flex-col gap-1 rounded-md p-2 hover:bg-gray-100"
            >
              <span className="block h-0.5 w-5 bg-gray-700" />
              <span className="block h-0.5 w-5 bg-gray-700" />
              <span className="block h-0.5 w-5 bg-gray-700" />
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-44 rounded-md border border-gray-200 bg-white shadow-lg z-10">
                  <button
                    type="button"
                    onClick={() => handlePageSwitch('visitor')}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                      page === 'visitor' ? 'font-semibold text-indigo-600' : 'text-gray-700'
                    }`}
                  >
                    顔登録用のQR作成
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePageSwitch('personnel')}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                      page === 'personnel' ? 'font-semibold text-indigo-600' : 'text-gray-700'
                    }`}
                  >
                    入場用のQR作成
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {view === 'form' && page === 'visitor' && (
          <VisitorForm onGenerate={handleGenerate} onReset={() => {}} />
        )}
        {view === 'form' && page === 'personnel' && (
          <PersonnelForm onGenerate={handleGenerate} onReset={() => {}} />
        )}
        {view === 'qr' && (
          <>
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
