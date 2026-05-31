'use client'

import { useState } from 'react'
import { useBookingStore, PaymentMethod } from '@/hooks/use-booking-store'
import { formatCurrency } from '@/utils/format-currency'

const methods: { id: PaymentMethod; label: string; icon: string; description: string }[] = [
  { id: 'PIX', label: 'Pix', icon: '⚡', description: 'Aprovação na hora' },
  { id: 'CREDIT_CARD', label: 'Cartão', icon: '💳', description: 'Crédito ou débito' },
  { id: 'CASH', label: 'Dinheiro', icon: '💵', description: 'Pague no local' },
]

export default function StepPaymentAndConfirm({ barberId }: { barberId: string }) {
  const store = useBookingStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatDate = (iso: string) =>
    new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long',
    })

  const handleConfirm = async () => {
    if (!store.paymentMethod) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: store.serviceId,
          barberId,
          date: store.date,
          time: store.time,
          customerName: store.customerName,
          customerWhatsApp: store.customerWhatsApp,
          paymentMethod: store.paymentMethod,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Erro ao criar agendamento.'); return }

      if (store.paymentMethod === 'CASH') {
        window.location.href = `/agendar/sucesso?id=${data.bookingId}`
      } else {
        window.location.href = `/agendar/pagamento?id=${data.bookingId}`
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-bold text-rb-charcoal">Como quer pagar?</h2>
      <p className="mb-6 text-rb-secondary">Confirme os dados e escolha a forma de pagamento.</p>

      {/* Resumo */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-rb-charcoal/10 bg-rb-surface">
        {[
          { label: 'Serviço', value: store.serviceName },
          { label: 'Data', value: store.date ? formatDate(store.date) : '' },
          { label: 'Horário', value: store.time },
          { label: 'Nome', value: store.customerName },
          { label: 'WhatsApp', value: store.customerWhatsApp },
        ].map((row, i) => (
          <div key={row.label} className={`flex justify-between gap-4 px-5 py-3 ${i > 0 ? 'border-t border-rb-charcoal/5' : ''}`}>
            <span className="text-sm text-rb-secondary">{row.label}</span>
            <span className="text-right text-sm font-semibold capitalize text-rb-charcoal">{row.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-rb-charcoal/10 bg-rb-charcoal/5 px-5 py-4">
          <span className="font-semibold text-rb-charcoal">Total</span>
          <span className="font-heading text-2xl font-bold text-rb-accent">
            {store.servicePrice ? formatCurrency(store.servicePrice) : '—'}
          </span>
        </div>
      </div>

      {/* Pagamento */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {methods.map(m => (
          <button
            key={m.id}
            onClick={() => store.setPaymentMethod(m.id)}
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-4 transition-all ${
              store.paymentMethod === m.id
                ? 'border-rb-accent bg-rb-charcoal text-rb-surface shadow-lg'
                : 'border-rb-charcoal/10 bg-rb-surface hover:border-rb-accent/40'
            }`}
          >
            <span className="text-2xl">{m.icon}</span>
            <span className={`text-sm font-bold ${store.paymentMethod === m.id ? 'text-rb-surface' : 'text-rb-charcoal'}`}>{m.label}</span>
            <span className={`text-xs ${store.paymentMethod === m.id ? 'text-rb-surface/60' : 'text-rb-secondary'}`}>{m.description}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => store.setStep(3)}
          disabled={loading}
          className="text-sm text-rb-secondary underline-offset-4 hover:text-rb-charcoal hover:underline"
        >
          ← Voltar
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading || !store.paymentMethod}
          className="flex items-center gap-2 rounded-xl bg-rb-accent px-8 py-3 text-sm font-semibold text-rb-surface shadow-lg shadow-rb-accent/20 transition-all hover:bg-rb-charcoal disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-rb-surface border-t-transparent" />}
          {loading ? 'Aguarde...' : 'Confirmar agendamento'}
        </button>
      </div>
    </div>
  )
}
