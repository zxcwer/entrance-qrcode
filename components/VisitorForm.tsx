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

const FIELDS: { name: keyof VisitorFormData; label: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'] }[] = [
  { name: 'lastname', label: '姓' },
  { name: 'firstname', label: '名' },
  { name: 'lastnameKana', label: '姓（カナ）' },
  { name: 'firstnameKana', label: '名（カナ）' },
  { name: 'company', label: '会社名' },
  { name: 'department', label: '部署' },
  { name: 'phone', label: '電話番号', inputMode: 'tel' },
  { name: 'vehicleNumber', label: '車両番号', inputMode: 'numeric' },
]

export default function VisitorForm({ onGenerate, onReset }: VisitorFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<VisitorFormData>({ mode: 'all' })

  const onSubmit = (data: VisitorFormData) => {
    onGenerate(JSON.stringify(data))
  }

  const handleReset = () => {
    reset()
    onReset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {FIELDS.map(({ name, label, inputMode }) => (
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
            inputMode={inputMode}
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
