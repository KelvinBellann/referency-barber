'use client'

import { useBookingStore, PaymentMethod } from '@/hooks/use-booking-store'
import { formatCurrency } from '@/utils/format-currency'

const methods: { id: PaymentMethod; label: string; description: string; icon: string }[] = [
  {
    id: 'PIX',
    label: 'Pix',
    description: 'Pagamento instantâneo. QR Code gerado na próxima etapa.',
    icon: '⚡',
  },
  {
    id: 'CREDIT_CARD',
    label: 'Cartão de Crédito',
    description: 'Pague com cartão de crédito de forma segura.',
    icon: '💳',
  },
  {
    id: 'CASH',
    label: 'Dinheiro no local',
    description: 'Pague na barbearia no dia do atendimento.',
    icon: '💵',
  },
]

export default function StepPaymentMethod() {
  const { servicePrice, serviceName, paymentMethod, setPaymentMethod, setStep } = useBookingStore()

  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-bold text-rb-charcoal">
        Forma de pagamento
      </h2>
      <p className="mb-2 text-rb-secondary">Como você prefere pagar?</p>

      {servicePrice && (
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-rb-accent/10 px-4 py-2">
          <span className="text-sm text-rb-secondary">{serviceName}</span>
          <span className="font-heading text-lg font-bold text-rb-accent">
            {formatCurrency(servicePrice)}
          </span>
        </div>
      )}

      <div className="space-y-3">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setPaymentMethod(m.id)}
            className={`flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all duration-200 ${
              paymentMethod === m.id
                ? 'border-rb-accent bg-rb-charcoal shadow-lg'
                : 'border-rb-charcoal/10 bg-rb-surface hover:border-rb-accent/40 hover:shadow-sm'
            }`}
          >
            <span className="text-2xl">{m.icon}</span>
            <div>
              <p className={`font-heading font-bold ${paymentMethod === m.id ? 'text-rb-surface' : 'text-rb-charcoal'}`}>
                {m.label}
              </p>
              <p className={`text-sm ${paymentMethod === m.id ? 'text-rb-surface/60' : 'text-rb-secondary'}`}>
                {m.description}
              </p>
            </div>
            {paymentMethod === m.id && (
              <span className="ml-auto text-rb-accent">✓</span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => setStep(5)}
        className="mt-6 text-sm text-rb-secondary underline-offset-4 hover:text-rb-charcoal hover:underline"
      >
        ← Voltar
      </button>
    </div>
  )
}
