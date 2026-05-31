'use client'

import { useBookingStore } from '@/hooks/use-booking-store'
import BookingProgress from './BookingProgress'
import StepService from './StepService'
import StepDateAndTime from './StepDateAndTime'
import StepCustomer from './StepCustomer'
import StepPaymentAndConfirm from './StepPaymentAndConfirm'

interface Service {
  id: string
  name: string
  description: string | null
  priceInCents: number
  durationMins: number
}

export default function BookingFlow({ services, barberId }: { services: Service[]; barberId: string }) {
  const { step } = useBookingStore()

  return (
    <div className="rounded-2xl border border-rb-charcoal/10 bg-rb-surface p-6 shadow-sm sm:p-8">
      <BookingProgress current={step} />
      {step === 1 && <StepService services={services} />}
      {step === 2 && <StepDateAndTime barberId={barberId} />}
      {step === 3 && <StepCustomer />}
      {step === 4 && <StepPaymentAndConfirm barberId={barberId} />}
    </div>
  )
}
