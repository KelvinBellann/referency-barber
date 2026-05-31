import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'
import { generateTimeSlots } from '@/utils/availability'
import { z } from 'zod'

const querySchema = z.object({
  barberId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  durationMins: z.coerce.number().int().min(15).max(180),
})

const DAY_MAP: Record<number, string> = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const parsed = querySchema.safeParse({
    barberId: searchParams.get('barberId'),
    date: searchParams.get('date'),
    durationMins: searchParams.get('durationMins'),
  })

  if (!parsed.success) {
    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
  }

  const { barberId, date, durationMins } = parsed.data

  const parts = date.split('-').map(Number)
  const jsDate = new Date(parts[0] ?? 0, (parts[1] ?? 1) - 1, parts[2] ?? 1)
  const dayOfWeek = DAY_MAP[jsDate.getDay()]

  const { data: schedule } = await supabase
    .from('Schedule')
    .select('startTime, endTime, breakStart, breakEnd, isActive')
    .eq('barberId', barberId)
    .eq('dayOfWeek', dayOfWeek)
    .single()

  if (!schedule || !schedule.isActive) {
    return NextResponse.json({ slots: [] })
  }

  const { data: blockedSlots } = await supabase
    .from('BlockedSlot')
    .select('startTime, endTime')
    .eq('barberId', barberId)
    .eq('date', date)

  const fullDayBlocked = (blockedSlots ?? []).some(
    (b: { startTime: string | null; endTime: string | null }) => !b.startTime && !b.endTime
  )
  if (fullDayBlocked) return NextResponse.json({ slots: [] })

  const allSlots = generateTimeSlots(
    schedule.startTime,
    schedule.endTime,
    durationMins,
    schedule.breakStart,
    schedule.breakEnd,
  )

  const { data: bookings } = await supabase
    .from('Booking')
    .select('appointmentTime')
    .eq('barberId', barberId)
    .eq('appointmentDate', date)
    .not('status', 'in', '("CANCELLED","NO_SHOW")')

  const bookedTimes = new Set((bookings ?? []).map((b: { appointmentTime: string }) => b.appointmentTime))
  const blockedTimes = new Set(
    (blockedSlots ?? [])
      .filter((b: { startTime: string | null }) => b.startTime)
      .map((b: { startTime: string | null }) => b.startTime as string)
  )

  const availableSlots = allSlots.filter(
    (slot) => !bookedTimes.has(slot) && !blockedTimes.has(slot)
  )

  return NextResponse.json({ slots: availableSlots })
}
