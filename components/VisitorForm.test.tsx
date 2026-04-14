import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import VisitorForm from './VisitorForm'

const fillAllFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('姓'), 'ほげほげ')
  await user.type(screen.getByLabelText('名'), 'ぼげぼげ')
  await user.type(screen.getByLabelText('姓（カナ）'), 'ほげほげ')
  await user.type(screen.getByLabelText('名（カナ）'), 'ぼげぼげ')
  await user.type(screen.getByLabelText('会社名'), 'ABC Company')
  await user.type(screen.getByLabelText('部署'), 'DX AI')
  await user.type(screen.getByLabelText('電話番号'), '123456789')
  await user.type(screen.getByLabelText('車両番号'), '1234')
}

describe('VisitorForm', () => {
  it('renders all 8 required fields', () => {
    render(<VisitorForm onGenerate={vi.fn()} onReset={vi.fn()} />)
    expect(screen.getByLabelText('姓')).toBeInTheDocument()
    expect(screen.getByLabelText('名')).toBeInTheDocument()
    expect(screen.getByLabelText('姓（カナ）')).toBeInTheDocument()
    expect(screen.getByLabelText('名（カナ）')).toBeInTheDocument()
    expect(screen.getByLabelText('会社名')).toBeInTheDocument()
    expect(screen.getByLabelText('部署')).toBeInTheDocument()
    expect(screen.getByLabelText('電話番号')).toBeInTheDocument()
    expect(screen.getByLabelText('車両番号')).toBeInTheDocument()
  })

  it('disables the submit button when the form is empty', () => {
    render(<VisitorForm onGenerate={vi.fn()} onReset={vi.fn()} />)
    expect(
      screen.getByRole('button', { name: 'QRコードを生成' })
    ).toBeDisabled()
  })

  it('enables the submit button when all fields are filled', async () => {
    const user = userEvent.setup()
    render(<VisitorForm onGenerate={vi.fn()} onReset={vi.fn()} />)
    await fillAllFields(user)
    expect(
      screen.getByRole('button', { name: 'QRコードを生成' })
    ).toBeEnabled()
  })

  it('calls onGenerate with a JSON string of all field values on submit', async () => {
    const user = userEvent.setup()
    const onGenerate = vi.fn()
    render(<VisitorForm onGenerate={onGenerate} onReset={vi.fn()} />)
    await fillAllFields(user)
    await user.click(screen.getByRole('button', { name: 'QRコードを生成' }))
    expect(onGenerate).toHaveBeenCalledWith(
      JSON.stringify({
        lastname: 'ほげほげ',
        firstname: 'ぼげぼげ',
        lastnameKana: 'ほげほげ',
        firstnameKana: 'ぼげぼげ',
        company: 'ABC Company',
        department: 'DX AI',
        phone: '123456789',
        vehicleNumber: '1234',
      })
    )
    expect(onGenerate).toHaveBeenCalledTimes(1)
  })

  it('calls onReset and clears all fields when Reset is clicked', async () => {
    const user = userEvent.setup()
    const onReset = vi.fn()
    render(<VisitorForm onGenerate={vi.fn()} onReset={onReset} />)
    await fillAllFields(user)
    await user.click(screen.getByRole('button', { name: 'リセット' }))
    expect(onReset).toHaveBeenCalled()
    expect(screen.getByLabelText('姓')).toHaveValue('')
    expect(screen.getByLabelText('会社名')).toHaveValue('')
  })
})
