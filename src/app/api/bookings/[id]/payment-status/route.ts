import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data: payment } = await supabase
    .from('Payment')
    .select('status')
    .eq('bookingId', id)
    .maybeSingle()

  return NextResponse.json({ status: payment?.status ?? 'PENDING' })
}
