'use client'

import { useState, useEffect } from 'react'
import { useBookingStore } from '@/hooks/use-booking-store'

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DAY_LABELS = ['D','S','T','Q','Q','S','S']

// 0=Sunday, 1=Monday blocked
const BLOCKED_DAYS = new Set([0, 1])

function generateSlots(): string[] {
  const slots: string[] = []

  // Manhã: 09:00 e 09:30
  slots.push('09:00', '09:30')

  // Tarde: 14:30 até 20:30 de 30 em 30
  for (let h = 14; h <= 20; h++) {
    for (const m of [0, 30]) {
      if (h === 14 && m === 0) continue // começa em 14:30
      const hh = h.toString().padStart(2, '0')
      const mm = m.toString().padStart(2, '0')
      slots.push(`${hh}:${mm}`)
    }
  }
  slots.push('20:30')

  return slots
}

const ALL_SLOTS = generateSlots()

export default function StepDateAndTime({ barberId }: { barberId: string }) {
  const { date, time, serviceId, setDate, setTime, setStep } = useBookingStore()
  const today = new Date()
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [bookedTimes, setBookedTimes] = useState<Set<string>>(new Set())
  const [loadingSlots, setLoadingSlots] = useState(false)

  const daysCount = new Date(view.year, view.month + 1, 0).getDate()
  const firstDay = new Date(view.year, view.month, 1).getDay()

  useEffect(() => {
    if (!date || !serviceId) return
    setLoadingSlots(true)
    fetch(`/api/availability?barberId=${barberId}&date=${date}&durationMins=30`)
      .then(r => r.json())
      .then(data => {
        const available = new Set<string>(data.slots ?? [])
        const booked = new Set(ALL_SLOTS.filter(s => !available.has(s)))
        setBookedTimes(booked)
      })
      .finally(() => setLoadingSlots(false))
  }, [date, barberId, serviceId])

  const toISO = (d: number) => {
    const y = view.year
    const m = String(view.month + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    return `${y}-${m}-${dd}`
  }

  const isSelectable = (d: number) => {
    const dayOfWeek = new Date(view.year, view.month, d).getDay()
    if (BLOCKED_DAYS.has(dayOfWeek)) return false
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return new Date(view.year, view.month, d) >= todayMidnight
  }

  const prevMonth = () =>
    setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 })

  const nextMonth = () =>
    setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 })

  const canProceed = date && time

  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-bold text-rb-charcoal">Quando quer vir?</h2>
      <p className="mb-6 text-rb-secondary">Terças a sábados · Manhã 09:00–09:30 · Tarde 14:30–20:30</p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <div className="rounded-2xl border border-rb-charcoal/10 bg-rb-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={prevMonth} className="rounded-lg p-2 text-rb-secondary hover:bg-rb-bg hover:text-rb-charcoal text-xl leading-none">‹</button>
            <span className="font-heading font-semibold text-rb-charcoal capitalize">
              {MONTHS[view.month]} {view.year}
            </span>
            <button onClick={nextMonth} className="rounded-lg p-2 text-rb-secondary hover:bg-rb-bg hover:text-rb-charcoal text-xl leading-none">›</button>
          </div>

          <div className="mb-2 grid grid-cols-7 text-center">
            {DAY_LABELS.map((d, i) => (
              <div key={i} className={`py-1 text-xs font-semibold ${BLOCKED_DAYS.has(i) ? 'text-rb-charcoal/20' : 'text-rb-secondary'}`}>
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysCount }).map((_, i) => {
              const d = i + 1
              const iso = toISO(d)
              const selectable = isSelectable(d)
              const selected = date === iso
              const dayOfWeek = new Date(view.year, view.month, d).getDay()
              const blocked = BLOCKED_DAYS.has(dayOfWeek)

              return (
                <button
                  key={d}
                  disabled={!selectable}
                  onClick={() => setDate(iso)}
                  className={`rounded-lg py-2 text-sm font-medium transition-all ${
                    selected
                      ? 'bg-rb-charcoal text-rb-surface font-bold'
                      : blocked
                      ? 'cursor-not-allowed text-rb-charcoal/20'
                      : selectable
                      ? 'text-rb-charcoal hover:bg-rb-accent hover:text-rb-surface'
                      : 'cursor-not-allowed text-rb-charcoal/25'
                  }`}
                >
                  {d}
                </button>
              )
            })}
          </div>

          <p className="mt-3 text-center text-xs text-rb-secondary/60">
            Dom e seg fechado
          </p>
        </div>

        {/* Time slots */}
        <div className="rounded-2xl border border-rb-charcoal/10 bg-rb-surface p-5">
          {!date ? (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 text-rb-secondary/60">
              <span className="text-3xl">📅</span>
              <p className="text-sm">Selecione uma data primeiro</p>
            </div>
          ) : loadingSlots ? (
            <div className="flex h-full min-h-[200px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-rb-accent border-t-transparent" />
            </div>
          ) : (
            <>
              <p className="mb-4 font-heading text-sm font-semibold text-rb-charcoal">
                {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}
              </p>
              <div className="grid grid-cols-3 gap-2 overflow-y-auto" style={{ maxHeight: '320px' }}>
                {ALL_SLOTS.map(slot => {
                  const booked = bookedTimes.has(slot)
                  const selected = time === slot
                  return (
                    <button
                      key={slot}
                      disabled={booked}
                      onClick={() => setTime(slot)}
                      className={`rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                        selected
                          ? 'border-rb-accent bg-rb-charcoal text-rb-surface'
                          : booked
                          ? 'cursor-not-allowed border-transparent bg-rb-charcoal/5 text-rb-charcoal/25 line-through'
                          : 'border-rb-charcoal/15 text-rb-charcoal hover:border-rb-accent hover:text-rb-accent'
                      }`}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setStep(1)}
          className="text-sm text-rb-secondary underline-offset-4 hover:text-rb-charcoal hover:underline"
        >
          ← Voltar
        </button>
        <button
          disabled={!canProceed}
          onClick={() => setStep(3)}
          className="rounded-xl bg-rb-accent px-8 py-3 text-sm font-semibold text-rb-surface transition-all hover:bg-rb-charcoal disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
