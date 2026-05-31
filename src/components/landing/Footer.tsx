import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-rb-charcoal border-t border-rb-surface/10">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://i.ibb.co/v6g1xjjW/Whats-App-Image-2026-05-31-at-1-10-24-PM.jpg"
              alt="Referency Barber"
              className="h-10 w-auto object-contain brightness-0 invert"
            />
            <p className="mt-3 text-sm leading-relaxed text-rb-surface/50">
              Barbearia premium com agendamento online. Qualidade e precisão em cada corte.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-rb-surface/40">
              Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: '#servicos', label: 'Serviços' },
                { href: '#barbeiros', label: 'Barbeiros' },
                { href: '#contato', label: 'Contato' },
                { href: '/agendar', label: 'Agendar' },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-rb-surface/50 transition-colors hover:text-rb-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-rb-surface/40">
              Contato
            </h4>
            <ul className="space-y-2 text-sm text-rb-surface/50">
              <li>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-rb-accent"
                >
                  WhatsApp
                </a>
              </li>
              <li>contato@referencybarber.com.br</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-rb-surface/10 pt-8 text-xs text-rb-surface/30 sm:flex-row">
          <p>© {new Date().getFullYear()} Referency Barber. Todos os direitos reservados.</p>
          <Link href="/privacidade" className="transition-colors hover:text-rb-accent">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  )
}
