'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import Shell from '../../ui/Shell'
import { useStore } from '../../core/store'
import { money } from '../../core/utils'
import { useMemo, useState } from 'react'
import { Button } from '../../ui/Button'

export default function PaymentPage() {
  const store = useStore()
  const params = useSearchParams()
  const router = useRouter()
  const ticketId = params.get('ticketId') ?? ''
  const ticket = useMemo(
    () => store.tickets.find((t) => t.id === ticketId),
    [ticketId, store.tickets]
  )
  const [method, setMethod] = useState<
    'CARD' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'BANK'
  >('CARD')
  const [card, setCard] = useState({
    number: '4242 4242 4242 4242',
    name: 'Volt Parker',
    exp: '12/30',
    cvc: '123',
  })

  const payNow = async () => {
    if (!ticket) return
    // simulate gateway processing delay
    await new Promise((r) => setTimeout(r, 600))
    store.payTicket(ticket.id, ticket.amount, method)
    const driverId = ticket.driverId
    store.notify({
      driverId,
      title: 'Payment received',
      body: `Ticket ${ticket.id.slice(-6)} is now paid.`,
    })
    router.push('/driver/tickets')
  }

  if (!ticket)
    return (
      <Shell
        title="Payment"
        nav={[
          { label: 'Home', href: '/driver', icon: 'home' },
          { label: 'Session', href: '/driver/session', icon: 'session' },
          { label: 'Tickets', href: '/driver/tickets', icon: 'tickets' },
          {
            label: 'Notifications',
            href: '/driver/notifications',
            icon: 'bell',
          },
        ]}
      >
        <div className="py-12 text-center text-[var(--muted-foreground)]">
          Select a ticket from Tickets to pay.
        </div>
      </Shell>
    )

  return (
    <Shell
      title="Payment"
      nav={[
        { label: 'Home', href: '/driver', icon: 'home' },
        { label: 'Session', href: '/driver/session', icon: 'session' },
        { label: 'Tickets', href: '/driver/tickets', icon: 'tickets' },
        { label: 'Notifications', href: '/driver/notifications', icon: 'bell' },
      ]}
    >
      <div className="rounded-xl bg-[var(--background)] p-8 shadow-sm sm:max-w-md">
        <h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">Pay Ticket</h2>
        <div className="mb-6 text-base text-[var(--muted-foreground)]">
          Ticket {ticket.id.slice(-6)} · Amount <span className="font-bold text-[var(--foreground)]">{money(ticket.amount)}</span>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-[var(--foreground)]">Payment Method</label>
            <div className="relative">
              <select
                className="flex h-12 w-full appearance-none rounded-lg bg-[var(--background)] px-4 py-2 text-base shadow-sm ring-1 ring-[var(--border)]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
              >
                <option value="CARD">Card</option>
                <option value="APPLE_PAY">Apple Pay</option>
                <option value="GOOGLE_PAY">Google Pay</option>
                <option value="BANK">Bank Transfer</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--muted-foreground)]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          {method === 'CARD' && (
            <div className="grid gap-4">
              <Input
                placeholder="Card number"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="MM/YY"
                  value={card.exp}
                  onChange={(e) => setCard({ ...card, exp: e.target.value })}
                />
                <Input
                  placeholder="CVC"
                  value={card.cvc}
                  onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                />
              </div>
              <Input
                placeholder="Cardholder name"
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value })}
              />
            </div>
          )}

          <Button onClick={payNow} className="w-full mt-2">
            Pay {money(ticket.amount)}
          </Button>
        </div>
      </div>
    </Shell>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`flex h-12 w-full rounded-lg bg-[var(--background)] px-4 py-2 text-base shadow-sm ring-1 ring-[var(--border)]/50 transition-all placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${props.className || ''}`}
    />
  )
}
