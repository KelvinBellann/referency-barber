'use client'

import { useEffect } from 'react'
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

interface Props {
  services: Service[]
  barberId: string
  preSelectedServiceId?: string
}

export default function BookingFlow({ services, barberId, preSelectedServiceId }: Props) {
  const { step, setService } = useBookingStore()

  // Se veio com serviceId na URL, pré-seleciona e vai direto pro step 2
  useEffect(() => {
    if (!preSelectedServiceId) return
    const service = services.find(s => s.id === preSelectedServiceId)
    if (service) {
      setService(service.id, service.name, service.priceInCents, service.durationMins)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSelectedServiceId])

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
