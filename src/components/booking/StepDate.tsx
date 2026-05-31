'use client'

import { useState } from 'react'
import { useBookingStore } from '@/hooks/use-booking-store'

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DAYS = ['D','S','T','Q','Q','S','S']

export default function StepDate() {
  const { date, setDate, setStep } = useBookingStore()
  const today = new Date()
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })

  const daysCount = getDaysInMonth(view.year, view.month)
  const firstDay = getFirstDayOfMonth(view.year, view.month)

  const isSelectable = (d: number) => {
    const selected = new Date(view.year, view.month, d)
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return selected >= todayMidnight
  }

  const toISO = (d: number) => {
    const y = view.year
    const m = String(view.month + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    return `${y}-${m}-${dd}`
  }

  const prevMonth = () => {
    setView(v =>
      v.month === 0
        ? { year: v.year - 1, month: 11 }
        : { year: v.year, month: v.month - 1 }
    )
  }

  const nextMonth = () => {
    setView(v =>
      v.month === 11
        ? { year: v.year + 1, month: 0 }
        : { year: v.year, month: v.month + 1 }
    )
  }

  return (
    <div>
      <h2 className="mb-2 font-heading text-2xl font-bold text-rb-charcoal">
        Escolha a data
      </h2>
      <p className="mb-8 text-rb-secondary">Selecione o dia do seu atendimento.</p>

      <div className="mx-auto max-w-sm rounded-2xl border border-rb-charcoal/10 bg-rb-surface p-6 shadow-sm">
        {/* Month nav */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="rounded-lg p-2 text-rb-secondary transition-colors hover:bg-rb-bg hover:text-rb-charcoal"
            aria-label="Mês anterior"
          >
            ‹
          </button>
          <span className="font-heading font-semibold text-rb-charcoal">
            {MONTHS[view.month]} {view.year}
          </span>
          <button
            onClick={nextMonth}
            className="rounded-lg p-2 text-rb-secondary transition-colors hover:bg-rb-bg hover:text-rb-charcoal"
            aria-label="Próximo mês"
          >
            ›
          </button>
        </div>

        {/* Day headers */}
        <div className="mb-2 grid grid-cols-7 text-center">
          {DAYS.map((d, i) => (
            <div key={i} className="py-1 text-xs font-semibold text-rb-secondary">
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysCount }).map((_, i) => {
            const d = i + 1
            const iso = toISO(d)
            const selectable = isSelectable(d)
            const selected = date === iso

            return (
              <button
                key={d}
                disabled={!selectable}
                onClick={() => setDate(iso)}
                className={`rounded-lg py-2 text-sm font-medium transition-all ${
                  selected
                    ? 'bg-rb-charcoal text-rb-surface'
                    : selectable
                    ? 'text-rb-charcoal hover:bg-rb-accent hover:text-rb-surface'
                    : 'cursor-not-allowed text-rb-charcoal/20'
                }`}
              >
                {d}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => setStep(2)}
          className="text-sm text-rb-secondary underline-offset-4 hover:text-rb-charcoal hover:underline"
        >
          ← Voltar
        </button>
      </div>
    </div>
  )
}
