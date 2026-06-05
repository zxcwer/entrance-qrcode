'use client'
import { useForm } from 'react-hook-form'

type PersonnelFormData = {
  lastname: string
  firstname: string
  company: string
  personDepartment: string
  person: string
  stayHours: number
}

interface PersonnelFormProps {
  onGenerate: (jsonPayload: string) => void
  onReset: () => void
}

const TEXT_FIELDS: { name: keyof Omit<PersonnelFormData, 'stayHours'>; label: string }[] = [
  { name: 'lastname', label: '姓' },
  { name: 'firstname', label: '名' },
  { name: 'company', label: '会社名' },
  { name: 'personDepartment', label: '担当者の部署' },
  { name: 'person', label: '担当者の名前' },
]

export default function PersonnelForm({ onGenerate, onReset }: PersonnelFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<PersonnelFormData>({ mode: 'all' })

  const onSubmit = (data: PersonnelFormData) => {
    onGenerate(JSON.stringify(data))
  }

  const handleReset = () => {
    reset()
    onReset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {TEXT_FIELDS.map(({ name, label }) => (
        <div key={name} className="flex flex-col gap-1">
          <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
          </label>
          <input
            id={name}
            {...register(name, { required: true })}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      ))}
      <div className="flex flex-col gap-1">
        <label htmlFor="stayHours" className="text-sm font-medium text-gray-700">
          滞在時間（時間）
        </label>
        <input
          id="stayHours"
          type="number"
          inputMode="numeric"
          min={1}
          {...register('stayHours', {
            required: true,
            valueAsNumber: true,
            min: { value: 1, message: '1以上の整数を入力してください' },
            validate: (v) => Number.isInteger(v) || '整数を入力してください',
          })}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {errors.stayHours?.message && (
          <p className="text-xs text-red-500">{errors.stayHours.message}</p>
        )}
      </div>
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
