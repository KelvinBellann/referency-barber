'use client'

const steps = [
  { n: 1, label: 'Serviço' },
  { n: 2, label: 'Data & Hora' },
  { n: 3, label: 'Dados' },
  { n: 4, label: 'Pagamento' },
]

export default function BookingProgress({ current }: { current: number }) {
  return (
    <nav aria-label="Etapas do agendamento" className="mb-10">
      <ol className="flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <li key={s.n} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  s.n < current
                    ? 'bg-rb-accent text-rb-surface'
                    : s.n === current
                    ? 'bg-rb-charcoal text-rb-surface ring-2 ring-rb-accent ring-offset-2'
                    : 'bg-rb-charcoal/10 text-rb-secondary'
                }`}
              >
                {s.n < current ? '✓' : s.n}
              </div>
              <span className={`text-xs ${s.n === current ? 'font-semibold text-rb-charcoal' : 'text-rb-secondary'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`mb-5 h-0.5 w-12 sm:w-20 ${s.n < current ? 'bg-rb-accent' : 'bg-rb-charcoal/10'}`} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
