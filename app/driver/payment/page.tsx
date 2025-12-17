'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import Shell from '../../ui/Shell'
import { useStore } from '../../core/store'
import { useAuth } from '../../core/auth'
import { money } from '../../core/utils'
import { useMemo, useState } from 'react'
import { Button } from '../../ui/Button'

export default function PaymentPage() {
  const store = useStore()
  const { user } = useAuth()
  const params = useSearchParams()
  const router = useRouter()
  const ticketId = params.get('ticketId') ?? ''
  const ticket = useMemo(
    () => store.tickets.find((t) => t.id === ticketId),
    [ticketId, store.tickets]
  )
  const [method, setMethod] = useState<
    'CARD' | 'MOMO' | 'AIRTEL_MONEY' | 'BANK'
  >('MOMO')
  const [card, setCard] = useState({
    number: '078 000 0000',
    name: 'Volt Parker',
    exp: '12/30',
    cvc: '123',
  })

  const payNow = async () => {
    if (!ticket) return
    await store.payTicket(ticket.id, ticket.fineAmount, method as any)
    if (user) {
      store.notify({
        userId: user.id,
        title: 'Payment received',
        message: `Ticket ${ticket.id.slice(-6)} is now paid.`,
        type: 'PAYMENT',
      })
    }
    router.push('/driver/tickets')
  }

  const notifications = store.notifications.filter((n) => n.userId === user?.id)

  if (!ticket)
    return (
      <Shell
        title="Payment"
        notifications={notifications}
        onMarkRead={store.markRead}
        nav={[
          { label: 'Home', href: '/driver', icon: 'home' },
          { label: 'Session', href: '/driver/session', icon: 'session' },
          { label: 'Tickets', href: '/driver/tickets', icon: 'tickets' },
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
      notifications={notifications}
      onMarkRead={store.markRead}
      nav={[
        { label: 'Home', href: '/driver', icon: 'home' },
        { label: 'Session', href: '/driver/session', icon: 'session' },
        { label: 'Tickets', href: '/driver/tickets', icon: 'tickets' },
      ]}
    >
      <div className="rounded-xl bg-[var(--background)] p-8 shadow-sm sm:max-w-md">
        <h2 className="mb-2 text-xl font-bold text-[var(--foreground)]">
          Pay Ticket
        </h2>
        <div className="mb-6 text-base text-[var(--muted-foreground)]">
          Ticket {ticket.id.slice(-6)} · Amount{' '}
          <span className="font-bold text-[var(--foreground)]">
            {money(ticket.fineAmount)}
          </span>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-[var(--foreground)]">
              Payment Method
            </label>
            <div className="relative">
              <select
                className="flex h-12 w-full appearance-none rounded-lg bg-[var(--background)] px-4 py-2 text-base shadow-sm ring-1 ring-[var(--border)]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
              >
                <option value="MOMO">MTN Mobile Money</option>
                <option value="AIRTEL_MONEY">Airtel Money</option>
                <option value="CARD">Credit Card</option>
                <option value="BANK">Bank Transfer</option>
              </select>
            </div>
          </div>

          {method === 'CARD' && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[var(--foreground)]">
                  Card Number
                </label>
                <input
                  className="flex h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-base shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">
                    Expiry
                  </label>
                  <input
                    className="flex h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-base shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    value={card.exp}
                    onChange={(e) => setCard({ ...card, exp: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">
                    CVC
                  </label>
                  <input
                    className="flex h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-base shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    value={card.cvc}
                    onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {(method === 'MOMO' || method === 'AIRTEL_MONEY') && (
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[var(--foreground)]">
                Phone Number
              </label>
              <input
                className="flex h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-base shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                value={card.number}
                onChange={(e) => setCard({ ...card, number: e.target.value })}
              />
            </div>
          )}

          <Button onClick={payNow} className="w-full">
            Pay {money(ticket.fineAmount)}
          </Button>
        </div>
      </div>
    </Shell>
  )
}
