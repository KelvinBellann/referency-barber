'use client'

import { useState } from 'react'
import { formatCurrency } from '@/utils/format-currency'

interface Props {
  bookingId: string
  amountInCents: number
  customerName: string
}

function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(v: string) {
  return v.replace(/\D/g, '').slice(0, 4).replace(/(.{2})/, '$1/')
}

export default function CardPayment({ bookingId, amountInCents, customerName }: Props) {
  const [form, setForm] = useState({
    number: '',
    name: customerName,
    expiry: '',
    cvv: '',
  })
  const [flipped, setFlipped] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (form.number.replace(/\s/g, '').length < 16) e.number = 'Número inválido'
    if (!form.name.trim()) e.name = 'Nome obrigatório'
    if (form.expiry.length < 5) e.expiry = 'Validade inválida'
    if (form.cvv.length < 3) e.cvv = 'CVV inválido'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)
    // In production: tokenize with MP Bricks, send token to server
    // Demo: directly simulate approval
    await fetch(`/api/bookings/${bookingId}/simulate-payment`, { method: 'POST' })
    setSubmitting(false)
  }

  const cardBrand = () => {
    const n = form.number.replace(/\s/g, '')
    if (n.startsWith('4')) return 'Visa'
    if (n.startsWith('5')) return 'Mastercard'
    if (n.startsWith('3')) return 'Amex'
    return ''
  }

  return (
    <div className="space-y-4">
      {/* Card preview */}
      <div
        className="relative mx-auto h-44 w-full max-w-sm cursor-pointer overflow-hidden rounded-2xl"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped(f => !f)}
      >
        <div
          className="relative h-full w-full transition-transform duration-500"
          style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : '' }}
        >
          {/* Front */}
          <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-rb-charcoal to-rb-accent p-5"
            style={{ backfaceVisibility: 'hidden' }}>
            <div className="flex items-center justify-between">
              <div className="h-8 w-12 rounded bg-yellow-400/80" />
              <span className="font-heading text-sm font-bold text-rb-surface/80">{cardBrand()}</span>
            </div>
            <div>
              <p className="font-mono text-lg tracking-widest text-rb-surface">
                {form.number || '•••• •••• •••• ••••'}
              </p>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <p className="text-xs text-rb-surface/50">Nome</p>
                  <p className="text-sm font-semibold uppercase text-rb-surface">
                    {form.name || 'SEU NOME'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-rb-surface/50">Validade</p>
                  <p className="text-sm font-semibold text-rb-surface">{form.expiry || 'MM/AA'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 flex flex-col justify-center rounded-2xl bg-gradient-to-br from-rb-charcoal to-rb-secondary"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div className="mb-4 h-10 bg-black/40" />
            <div className="mx-5 flex items-center justify-end rounded bg-rb-surface/10 px-3 py-2">
              <p className="font-mono text-sm text-rb-surface">{form.cvv || '•••'}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-rb-secondary">Clique no cartão para ver o verso</p>

      {/* Form */}
      <div className="rounded-2xl border border-rb-charcoal/10 bg-rb-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-rb-charcoal">Dados do cartão</h2>
          <span className="font-heading text-lg font-bold text-rb-accent">{formatCurrency(amountInCents)}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-rb-charcoal">Número do cartão</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={form.number}
              onChange={e => setForm(f => ({ ...f, number: formatCardNumber(e.target.value) }))}
              className={`w-full rounded-xl border px-4 py-3 font-mono text-sm outline-none transition-all focus:ring-2 focus:ring-rb-accent/30 ${errors.number ? 'border-red-400 bg-red-50' : 'border-rb-charcoal/15 bg-rb-bg focus:border-rb-accent'}`}
            />
            {errors.number && <p className="mt-1 text-xs text-red-500">{errors.number}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-rb-charcoal">Nome no cartão</label>
            <input
              type="text"
              placeholder="Como está no cartão"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value.toUpperCase() }))}
              className={`w-full rounded-xl border px-4 py-3 text-sm uppercase outline-none transition-all focus:ring-2 focus:ring-rb-accent/30 ${errors.name ? 'border-red-400 bg-red-50' : 'border-rb-charcoal/15 bg-rb-bg focus:border-rb-accent'}`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-rb-charcoal">Validade</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/AA"
                value={form.expiry}
                onChange={e => setForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-rb-accent/30 ${errors.expiry ? 'border-red-400 bg-red-50' : 'border-rb-charcoal/15 bg-rb-bg focus:border-rb-accent'}`}
              />
              {errors.expiry && <p className="mt-1 text-xs text-red-500">{errors.expiry}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-rb-charcoal">CVV</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="123"
                maxLength={4}
                value={form.cvv}
                onFocus={() => setFlipped(true)}
                onBlur={() => setFlipped(false)}
                onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-rb-accent/30 ${errors.cvv ? 'border-red-400 bg-red-50' : 'border-rb-charcoal/15 bg-rb-bg focus:border-rb-accent'}`}
              />
              {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rb-accent py-3.5 text-sm font-semibold text-rb-surface shadow-lg shadow-rb-accent/20 transition-all hover:bg-rb-charcoal disabled:opacity-60"
          >
            {submitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-rb-surface border-t-transparent" />}
            {submitting ? 'Processando...' : `Pagar ${formatCurrency(amountInCents)}`}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-rb-secondary">
          <span>🔒</span>
          <span>Dados protegidos. Nenhuma informação é armazenada.</span>
        </div>

        <p className="mt-3 text-center text-xs text-yellow-600">
          🧪 Modo demonstração — qualquer cartão válido é aceito
        </p>
      </div>
    </div>
  )
}
