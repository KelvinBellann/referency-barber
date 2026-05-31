'use client'

import { useState } from 'react'
import { formatCurrency } from '@/utils/format-currency'

// Fake Pix key for demo — replace with real MP-generated key in production
const DEMO_PIX_KEY = '00020126580014br.gov.bcb.pix0136demo-referency-barber-pix-key5204000053039865802BR5925Referency Barber Demo6009Sao Paulo62070503***6304ABCD'
const DEMO_QR_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(DEMO_PIX_KEY)

interface Props {
  bookingId: string
  amountInCents: number
}

export default function PixPayment({ bookingId, amountInCents }: Props) {
  const [copied, setCopied] = useState(false)
  const [simulating, setSimulating] = useState(false)

  const copyKey = () => {
    navigator.clipboard.writeText(DEMO_PIX_KEY)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simulates payment approval (demo only — in prod this comes via MP webhook)
  const simulateApproval = async () => {
    setSimulating(true)
    await fetch(`/api/bookings/${bookingId}/simulate-payment`, { method: 'POST' })
    setSimulating(false)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-rb-charcoal/10 bg-rb-surface p-6">
        <h2 className="mb-1 font-heading text-lg font-bold text-rb-charcoal">Pagar com Pix</h2>
        <p className="mb-6 text-sm text-rb-secondary">
          Escaneie o QR Code ou copie o código Pix abaixo. O pagamento é confirmado em segundos.
        </p>

        {/* QR Code */}
        <div className="mb-6 flex flex-col items-center gap-4">
          <div className="rounded-xl border-4 border-rb-charcoal/10 bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={DEMO_QR_URL}
              alt="QR Code Pix"
              width={180}
              height={180}
              className="block"
            />
          </div>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            🧪 Dados de demonstração
          </span>
        </div>

        {/* Amount */}
        <div className="mb-4 flex items-center justify-between rounded-xl bg-rb-bg px-4 py-3">
          <span className="text-sm text-rb-secondary">Valor</span>
          <span className="font-heading text-xl font-bold text-rb-charcoal">
            {formatCurrency(amountInCents)}
          </span>
        </div>

        {/* Copy key */}
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-rb-secondary">
            Código Pix Copia e Cola
          </p>
          <div className="flex gap-2">
            <div className="flex-1 truncate rounded-lg border border-rb-charcoal/10 bg-rb-bg px-3 py-2.5 text-xs text-rb-secondary">
              {DEMO_PIX_KEY.slice(0, 60)}…
            </div>
            <button
              onClick={copyKey}
              className="shrink-0 rounded-lg bg-rb-charcoal px-4 py-2.5 text-xs font-semibold text-rb-surface transition-all hover:bg-rb-accent"
            >
              {copied ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Steps */}
        <ol className="space-y-1.5 text-sm text-rb-secondary">
          {[
            'Abra o app do seu banco',
            'Escolha pagar com Pix',
            'Escaneie o QR Code ou cole o código',
            'Confirme o pagamento',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rb-accent/10 text-xs font-bold text-rb-accent">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      {/* Demo button — remove in production */}
      <div className="rounded-xl border border-dashed border-yellow-400 bg-yellow-50 p-4 text-center">
        <p className="mb-3 text-xs font-semibold text-yellow-700">
          🧪 Modo demonstração — clique para simular pagamento aprovado
        </p>
        <button
          onClick={simulateApproval}
          disabled={simulating}
          className="rounded-lg bg-yellow-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-yellow-600 disabled:opacity-60"
        >
          {simulating ? 'Processando...' : 'Simular pagamento aprovado'}
        </button>
      </div>
    </div>
  )
}
