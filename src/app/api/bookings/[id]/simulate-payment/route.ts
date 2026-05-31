import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

// Demo-only endpoint — simulates payment approval without Mercado Pago
// Remove or protect this in production
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_MP_ENVIRONMENT !== 'sandbox') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const { id } = await params

  const { data: booking } = await supabase
    .from('Booking')
    .select('id, priceAtBooking, paymentMethod, status')
    .eq('id', id)
    .single()

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // Upsert payment record
  const { data: existingPayment } = await supabase
    .from('Payment')
    .select('id')
    .eq('bookingId', id)
    .maybeSingle()

  if (existingPayment) {
    await supabase
      .from('Payment')
      .update({ status: 'APPROVED', paidAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .eq('bookingId', id)
  } else {
    await supabase.from('Payment').insert({
      bookingId: id,
      method: booking.paymentMethod,
      status: 'APPROVED',
      amountInCents: booking.priceAtBooking,
      mpExternalRef: `demo-${id}`,
      paidAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  // Confirm booking
  await supabase
    .from('Booking')
    .update({ status: 'CONFIRMED', confirmedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ ok: true })
}
