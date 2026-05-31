import Link from 'next/link'

const barbers = [
  {
    id: 'barber-01',
    name: 'João Silva',
    role: 'Barbeiro Profissional',
    bio: '10 anos de experiência em cortes modernos e clássicos. Especialista em degradê e barba.',
    specialties: ['Degradê', 'Barba', 'Corte Social'],
    avatar: null,
  },
]

export default function Barbers() {
  return (
    <section id="barbeiros" className="bg-rb-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-rb-accent">
            Quem vai te atender
          </span>
          <h2 className="font-heading text-4xl font-bold text-rb-charcoal">
            Nosso Profissional
          </h2>
          <p className="mx-auto mt-4 max-w-md text-rb-secondary">
            Experiente, dedicado e apaixonado pela arte da barbearia.
          </p>
        </div>

        {/* Cards */}
        <div className="flex justify-center">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="w-full max-w-sm overflow-hidden rounded-2xl bg-rb-charcoal shadow-xl"
            >
              {/* Photo placeholder */}
              <div className="flex h-72 items-center justify-center bg-rb-charcoal/80">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-rb-accent/20 ring-4 ring-rb-accent/30">
                  <span className="font-heading text-4xl font-bold text-rb-accent">
                    {barber.name.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="font-heading text-xl font-bold text-rb-surface">
                  {barber.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-rb-accent">{barber.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-rb-surface/60">{barber.bio}</p>

                {/* Specialties */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {barber.specialties.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-rb-accent/30 bg-rb-accent/10 px-3 py-1 text-xs font-medium text-rb-accent"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <Link
                  href="/agendar"
                  className="mt-6 block rounded-lg bg-rb-accent py-3 text-center text-sm font-semibold text-rb-surface transition-all duration-200 hover:bg-rb-surface hover:text-rb-charcoal"
                >
                  Agendar com {barber.name.split(' ')[0]}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
