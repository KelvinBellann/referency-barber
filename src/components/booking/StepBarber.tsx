'use client'

import { useBookingStore } from '@/hooks/use-booking-store'

interface Barber {
  id: string
  name: string
  bio: string | null
}

export default function StepBarber({ barbers }: { barbers: Barber[] }) {
  const { barberId, setBarber, setStep } = useBookingStore()

  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-bold text-rb-charcoal">
        Escolha o barbeiro
      </h2>
      <p className="mb-8 text-rb-secondary">Com quem você quer ser atendido?</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {barbers.map((b) => (
          <button
            key={b.id}
            onClick={() => setBarber(b.id, b.name)}
            className={`flex items-center gap-4 rounded-xl border p-5 text-left transition-all duration-200 hover:border-rb-accent ${
              barberId === b.id
                ? 'border-rb-accent bg-rb-charcoal shadow-lg'
                : 'border-rb-charcoal/10 bg-rb-surface hover:shadow-md'
            }`}
          >
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${barberId === b.id ? 'bg-rb-accent/20' : 'bg-rb-charcoal/10'}`}>
              <span className={`font-heading text-xl font-bold ${barberId === b.id ? 'text-rb-accent' : 'text-rb-charcoal'}`}>
                {b.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className={`font-heading font-bold ${barberId === b.id ? 'text-rb-surface' : 'text-rb-charcoal'}`}>
                {b.name}
              </p>
              {b.bio && (
                <p className={`mt-1 text-sm ${barberId === b.id ? 'text-rb-surface/60' : 'text-rb-secondary'}`}>
                  {b.bio}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => setStep(1)}
        className="mt-6 text-sm text-rb-secondary underline-offset-4 hover:text-rb-charcoal hover:underline"
      >
        ← Voltar
      </button>
    </div>
  )
}
