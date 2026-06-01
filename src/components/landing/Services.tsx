import Link from 'next/link'

const services = [
  {
    id: 'service-corte',
    name: 'Corte de Cabelo',
    description: 'Corte profissional com acabamento premium e técnicas modernas.',
    price: 'R$ 30',
    duration: '30 min',
    icon: '✂️',
  },
  {
    id: 'service-cabelo-sobrancelha',
    name: 'Cabelo + Sobrancelha',
    description: 'Corte de cabelo com design e alinhamento de sobrancelha.',
    price: 'R$ 35',
    duration: '45 min',
    icon: '👁️',
  },
  {
    id: 'service-barba-cabelo',
    name: 'Barba + Cabelo',
    description: 'Corte de barba completo com navalha e corte de cabelo.',
    price: 'R$ 35',
    duration: '45 min',
    icon: '🪒',
  },
  {
    id: 'service-combo-completo',
    name: 'Combo Completo',
    description: 'Pacote completo: cabelo, sobrancelha e barba. O melhor custo-benefício.',
    price: 'R$ 40',
    duration: '60 min',
    popular: true,
    icon: '⭐',
  },
]

export default function Services() {
  return (
    <section id="servicos" className="bg-rb-bg py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-rb-accent">
            O que oferecemos
          </span>
          <h2 className="font-heading text-4xl font-bold text-rb-charcoal">
            Nossos Serviços
          </h2>
          <p className="mx-auto mt-4 max-w-md text-rb-secondary">
            Escolha o serviço ideal para você. Preços fixos, sem surpresas.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.id}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                service.popular
                  ? 'border-rb-accent bg-rb-charcoal text-rb-surface shadow-lg shadow-rb-accent/10'
                  : 'border-rb-charcoal/10 bg-rb-surface text-rb-charcoal hover:border-rb-accent/30'
              }`}
            >
              {service.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-rb-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-rb-surface">
                  Popular
                </span>
              )}

              <div className="mb-4 text-3xl">{service.icon}</div>

              <h3
                className={`mb-2 font-heading text-lg font-bold ${
                  service.popular ? 'text-rb-surface' : 'text-rb-charcoal'
                }`}
              >
                {service.name}
              </h3>

              <p
                className={`mb-6 flex-1 text-sm leading-relaxed ${
                  service.popular ? 'text-rb-surface/60' : 'text-rb-secondary'
                }`}
              >
                {service.description}
              </p>

              <div className="mb-6 flex items-end justify-between">
                <span
                  className={`font-heading text-3xl font-bold ${
                    service.popular ? 'text-rb-accent' : 'text-rb-charcoal'
                  }`}
                >
                  {service.price}
                </span>
                <span
                  className={`text-xs ${
                    service.popular ? 'text-rb-surface/40' : 'text-rb-secondary'
                  }`}
                >
                  {service.duration}
                </span>
              </div>

              <Link
                href={`/agendar?serviceId=${service.id}`}
                className={`rounded-lg py-2.5 text-center text-sm font-semibold transition-all duration-200 ${
                  service.popular
                    ? 'bg-rb-accent text-rb-surface hover:bg-rb-surface hover:text-rb-charcoal'
                    : 'border border-rb-charcoal/20 text-rb-charcoal hover:border-rb-accent hover:text-rb-accent'
                }`}
              >
                Agendar
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
