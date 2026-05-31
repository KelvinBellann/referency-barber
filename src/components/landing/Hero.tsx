import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-rb-charcoal">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #F5F3F0 0px,
            #F5F3F0 1px,
            transparent 1px,
            transparent 50%
          )`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Accent glow */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rb-accent/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Tag */}
        <span className="mb-6 inline-block rounded-full border border-rb-accent/40 bg-rb-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-rb-accent">
          Barbearia Premium
        </span>

        {/* Headline */}
        <h1 className="mb-6 font-heading text-5xl font-bold leading-tight tracking-tight text-rb-surface md:text-6xl lg:text-7xl">
          O Estilo que
          <br />
          <span className="text-rb-accent">Define Você</span>
        </h1>

        {/* Sub */}
        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-rb-surface/60">
          Cortes precisos, acabamento impecável. Agende online em minutos e chegue para ser atendido com hora marcada.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/agendar"
            className="rounded-lg bg-rb-accent px-8 py-4 text-base font-semibold text-rb-surface shadow-lg shadow-rb-accent/20 transition-all duration-200 hover:bg-rb-surface hover:text-rb-charcoal hover:shadow-rb-surface/20"
          >
            Agendar Agora
          </Link>
          <a
            href="#servicos"
            className="rounded-lg border border-rb-surface/20 px-8 py-4 text-base font-semibold text-rb-surface/80 transition-all duration-200 hover:border-rb-accent hover:text-rb-accent"
          >
            Ver Serviços
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-rb-surface/10 pt-16">
          {[
            { value: '10+', label: 'Anos de experiência' },
            { value: '1000+', label: 'Clientes satisfeitos' },
            { value: '4.9★', label: 'Avaliação média' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-heading text-3xl font-bold text-rb-accent">{stat.value}</p>
              <p className="mt-1 text-sm text-rb-surface/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-rb-surface/30 p-1.5">
          <div className="h-2 w-1 animate-pulse rounded-full bg-rb-accent" />
        </div>
      </div>
    </section>
  )
}
