'use client'

import { useEffect, useState } from 'react'
import { useBookingStore } from '@/hooks/use-booking-store'

export default function StepTime() {
  const { barberId, date, serviceDuration, time, setTime, setStep } = useBookingStore()
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!barberId || !date || !serviceDuration) return

    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    fetch(`/api/availability?barberId=${barberId}&date=${date}&durationMins=${serviceDuration}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setSlots(data.slots ?? []) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [barberId, date, serviceDuration])

  const formatDate = (iso: string) => {
    const parts = iso.split('-').map(Number)
    return new Date(parts[0] ?? 0, (parts[1] ?? 1) - 1, parts[2] ?? 1).toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long',
    })
  }

  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-bold text-rb-charcoal">
        Escolha o horário
      </h2>
      <p className="mb-8 text-rb-secondary">
        {date && <span className="font-medium capitalize">{formatDate(date)}</span>}
      </p>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-rb-accent border-t-transparent" />
        </div>
      ) : slots.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 text-rb-secondary">
          <span className="text-3xl">😔</span>
          <p>Nenhum horário disponível neste dia.</p>
          <button
            onClick={() => setStep(3)}
            className="mt-2 text-sm text-rb-accent underline-offset-4 hover:underline"
          >
            Escolher outra data
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => setTime(slot)}
              className={`rounded-xl border py-3 text-sm font-semibold transition-all duration-200 ${
                time === slot
                  ? 'border-rb-accent bg-rb-charcoal text-rb-surface shadow-md'
                  : 'border-rb-charcoal/10 bg-rb-surface text-rb-charcoal hover:border-rb-accent hover:text-rb-accent'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setStep(3)}
        className="mt-8 text-sm text-rb-secondary underline-offset-4 hover:text-rb-charcoal hover:underline"
      >
        ← Voltar
      </button>
    </div>
  )
}
