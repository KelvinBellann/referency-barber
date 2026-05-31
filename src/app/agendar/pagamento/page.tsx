import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase-server'
import PaymentClient from './PaymentClient'
import { formatCurrency } from '@/utils/format-currency'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ id?: string }>
}

export default async function PaymentPage({ searchParams }: Props) {
  const { id } = await searchParams

  if (!id) notFound()

  const { data: booking } = await supabase
    .from('Booking')
    .select('id, priceAtBooking, paymentMethod, appointmentDate, appointmentTime, customerName, service:serviceId(name), barber:barberId(name)')
    .eq('id', id)
    .single()

  if (!booking) notFound()

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long', day: '2-digit', month: 'long',
    })

  return (
    <main className="min-h-screen bg-rb-bg py-12">
      <div className="mx-auto max-w-lg px-6">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-4 inline-block font-heading text-sm font-bold uppercase tracking-widest text-rb-accent">
            ← Referency Barber
          </Link>
          <h1 className="font-heading text-2xl font-bold text-rb-charcoal">Pagamento</h1>
        </div>

        {/* Booking summary */}
        <div className="mb-6 rounded-2xl border border-rb-charcoal/10 bg-rb-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading font-bold text-rb-charcoal">
                {(booking.service as unknown as { name: string } | null)?.name}
              </p>
              <p className="text-sm text-rb-secondary">
                {(booking.barber as unknown as { name: string } | null)?.name} · {formatDate(booking.appointmentDate)} às {booking.appointmentTime}
              </p>
            </div>
            <span className="font-heading text-2xl font-bold text-rb-accent">
              {formatCurrency(booking.priceAtBooking)}
            </span>
          </div>
        </div>

        <PaymentClient
          bookingId={booking.id}
          paymentMethod={booking.paymentMethod}
          amountInCents={booking.priceAtBooking}
          customerName={booking.customerName}
        />
      </div>
    </main>
  )
}
