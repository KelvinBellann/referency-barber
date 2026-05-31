import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'
import { z } from 'zod'

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  barberId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  customerName: z.string().min(2).max(100),
  customerWhatsApp: z.string().min(10).max(20),
  paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'CASH']),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Corpo inválido' }, { status: 400 }) }

  const parsed = bookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 422 })
  }

  const { serviceId, barberId, date, time, customerName, customerWhatsApp, paymentMethod } = parsed.data

  // Price always from DB — never trust client
  const { data: service } = await supabase
    .from('Service').select('priceInCents, isActive').eq('id', serviceId).single()
  if (!service?.isActive) return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 })

  // Check double-booking
  const { data: conflict } = await supabase
    .from('Booking').select('id')
    .eq('barberId', barberId).eq('appointmentDate', date).eq('appointmentTime', time)
    .not('status', 'in', '("CANCELLED","NO_SHOW")').maybeSingle()
  if (conflict) return NextResponse.json({ error: 'Horário indisponível. Escolha outro.' }, { status: 409 })

  const status = paymentMethod === 'CASH' ? 'PENDING_PAYMENT' : 'AWAITING_PAYMENT'

  const { data: booking, error } = await supabase
    .from('Booking')
    .insert({
      barberId,
      serviceId,
      priceAtBooking: service.priceInCents,
      appointmentDate: date,
      appointmentTime: time,
      status,
      paymentMethod,
      customerName: customerName.trim(),
      customerEmail: '',
      customerPhone: customerWhatsApp.replace(/\D/g, ''),
      updatedAt: new Date().toISOString(),
    })
    .select('id').single()

  if (error || !booking) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Erro ao criar agendamento.' }, { status: 500 })
  }

  return NextResponse.json({ bookingId: booking.id }, { status: 201 })
}
