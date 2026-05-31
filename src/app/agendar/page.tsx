import Link from 'next/link'
import { supabase } from '@/lib/supabase-server'
import BookingFlow from '@/components/booking/BookingFlow'

export const dynamic = 'force-dynamic'

export default async function AgendarPage() {
  const [{ data: services }, { data: barbers }] = await Promise.all([
    supabase
      .from('Service')
      .select('id, name, description, priceInCents, durationMins')
      .eq('isActive', true)
      .order('displayOrder', { ascending: true }),
    supabase
      .from('Barber')
      .select('id')
      .eq('isActive', true)
      .limit(1),
  ])

  const barberId = barbers?.[0]?.id ?? ''

  return (
    <main className="min-h-screen bg-rb-bg py-12">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-10 text-center">
          <Link href="/" className="mb-4 inline-block font-heading text-sm font-bold uppercase tracking-widest text-rb-accent">
            ← Referency Barber
          </Link>
          <h1 className="font-heading text-3xl font-bold text-rb-charcoal">Agendar Atendimento</h1>
          <p className="mt-2 text-rb-secondary">Rápido, fácil e sem complicação.</p>
        </div>

        <BookingFlow services={services ?? []} barberId={barberId} />
      </div>
    </main>
  )
}
