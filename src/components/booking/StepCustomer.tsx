'use client'

import { useState } from 'react'
import { useBookingStore } from '@/hooks/use-booking-store'

export default function StepCustomer() {
  const { customerName, customerWhatsApp, setCustomer, setStep } = useBookingStore()
  const [name, setName] = useState(customerName)
  const [whatsapp, setWhatsapp] = useState(customerWhatsApp)
  const [errors, setErrors] = useState<{ name?: string; whatsapp?: string }>({})

  const formatPhone = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: { name?: string; whatsapp?: string } = {}
    if (name.trim().length < 2) errs.name = 'Informe seu nome'
    const digits = whatsapp.replace(/\D/g, '')
    if (digits.length < 10) errs.whatsapp = 'WhatsApp inválido'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setCustomer(name.trim(), whatsapp.trim())
  }

  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-bold text-rb-charcoal">Quase lá!</h2>
      <p className="mb-8 text-rb-secondary">Só precisamos de 2 informações para confirmar.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-rb-charcoal">
            Seu nome
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="João Silva"
            value={name}
            onChange={e => setName(e.target.value)}
            className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-rb-accent/30 ${
              errors.name ? 'border-red-400 bg-red-50' : 'border-rb-charcoal/15 bg-rb-surface focus:border-rb-accent'
            }`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="whatsapp" className="mb-1.5 block text-sm font-semibold text-rb-charcoal">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            placeholder="(11) 99999-9999"
            value={whatsapp}
            onChange={e => setWhatsapp(formatPhone(e.target.value))}
            className={`w-full rounded-xl border px-4 py-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-rb-accent/30 ${
              errors.whatsapp ? 'border-red-400 bg-red-50' : 'border-rb-charcoal/15 bg-rb-surface focus:border-rb-accent'
            }`}
          />
          {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp}</p>}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="text-sm text-rb-secondary underline-offset-4 hover:text-rb-charcoal hover:underline"
          >
            ← Voltar
          </button>
          <button
            type="submit"
            className="rounded-xl bg-rb-accent px-8 py-3 text-sm font-semibold text-rb-surface transition-all hover:bg-rb-charcoal"
          >
            Continuar →
          </button>
        </div>
      </form>
    </div>
  )
}
