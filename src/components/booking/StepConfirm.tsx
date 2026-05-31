'use client'

import { useState } from 'react'
import { useBookingStore } from '@/hooks/use-booking-store'
import { formatCurrency } from '@/utils/format-currency'

const paymentLabels = {
  PIX: 'Pix',
  CREDIT_CARD: 'Cartão de Crédito',
  CASH: 'Dinheiro no local',
}

export default function StepConfirm() {
  const store = useBookingStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatDate = (iso: string) => {
    const parts = iso.split('-').map(Number)
    return new Date(parts[0] ?? 0, (parts[1] ?? 1) - 1, parts[2] ?? 1).toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    })
  }

  const handleConfirm = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: store.serviceId,
          barberId: store.barberId,
          date: store.date,
          time: store.time,
          customerName: store.customerName,
          customerEmail: store.customerEmail,
          customerPhone: store.customerPhone,
          paymentMethod: store.paymentMethod,
          notes: store.notes,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Erro ao criar agendamento.')
        return
      }

      // Redirect to payment or success page
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

  const rows = [
    { label: 'Serviço', value: store.serviceName },
    { label: 'Barbeiro', value: store.barberName },
    { label: 'Data', value: store.date ? formatDate(store.date) : '' },
    { label: 'Horário', value: store.time },
    { label: 'Nome', value: store.customerName },
    { label: 'Email', value: store.customerEmail },
    { label: 'Telefone', value: store.customerPhone },
    { label: 'Pagamento', value: store.paymentMethod ? paymentLabels[store.paymentMethod] : '' },
  ]

  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-bold text-rb-charcoal">
        Confirmar agendamento
      </h2>
      <p className="mb-8 text-rb-secondary">Verifique os dados antes de confirmar.</p>

      {/* Summary */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-rb-charcoal/10 bg-rb-surface">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className={`flex justify-between gap-4 px-5 py-3 ${
              i < rows.length - 1 ? 'border-b border-rb-charcoal/5' : ''
            }`}
          >
            <span className="text-sm text-rb-secondary">{r.label}</span>
            <span className="text-right text-sm font-semibold capitalize text-rb-charcoal">
              {r.value}
            </span>
          </div>
        ))}

        {/* Total */}
        <div className="flex items-center justify-between border-t border-rb-charcoal/10 bg-rb-charcoal/5 px-5 py-4">
          <span className="font-semibold text-rb-charcoal">Total</span>
          <span className="font-heading text-2xl font-bold text-rb-accent">
            {store.servicePrice ? formatCurrency(store.servicePrice) : '—'}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={() => store.setStep(6)}
          disabled={loading}
          className="text-sm text-rb-secondary underline-offset-4 hover:text-rb-charcoal hover:underline"
        >
          ← Voltar
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="ml-auto flex items-center gap-2 rounded-xl bg-rb-accent px-8 py-3 text-sm font-semibold text-rb-surface shadow-lg shadow-rb-accent/20 transition-all hover:bg-rb-charcoal disabled:opacity-60"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-rb-surface border-t-transparent" />
          )}
          {loading ? 'Aguarde...' : 'Confirmar agendamento'}
        </button>
      </div>
    </div>
  )
}
