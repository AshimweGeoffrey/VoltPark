'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import Shell from '../../ui/Shell'
import { useStore } from '../../core/store'
import { money } from '../../core/utils'
import { Button } from '../../ui/Button'

export default function TicketsPage() {
  const store = useStore()
  useEffect(() => {
    store.seed()
  }, [])

  const driver = store.users.find((u) => u.role === 'DRIVER')
  const mine = store.tickets.filter((t) => t.driverId === driver?.id)

  const ensureSample = () => {
    if (!driver || mine.length) return
    const z = store.zones[0]
    store.issueTicket({
      driverId: driver.id,
      zoneId: z.id,
      amount: z.fineAmount,
      notes: 'Overstayed limit',
    })
  }
  useEffect(() => {
    ensureSample()
  }, [driver, mine.length])

  const onAppeal = (id: string) => {
    const reason = prompt('Appeal reason:')
    if (reason) store.appealTicket(id, reason)
  }

  return (
    <Shell
      title="Tickets"
      nav={[
        { label: 'Home', href: '/driver', icon: 'home' },
        { label: 'Session', href: '/driver/session', icon: 'session' },
        { label: 'Tickets', href: '/driver/tickets', icon: 'tickets' },
        { label: 'Notifications', href: '/driver/notifications', icon: 'bell' },
      ]}
    >
      <div className="grid gap-6 sm:max-w-2xl">
        {mine.map((t) => (
          <div
            key={t.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-[var(--background)] p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div>
              <div className="text-sm font-medium text-[var(--muted-foreground)]">
                {new Date(t.issuedAt).toLocaleString()}
              </div>
              <div className="mt-1 flex items-center gap-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  t.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                  t.status === 'APPEALED' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {t.status}
                </span>
                <span className="text-xl font-bold text-[var(--foreground)]">
                  {money(t.amount)}
                </span>
              </div>
              <div className="mt-1 text-sm text-[var(--muted-foreground)]">
                {t.notes}
              </div>
            </div>
            <div className="flex gap-3">
              {(t.status === 'NEW' || t.status === 'ISSUED') && (
                <Link
                  href={{
                    pathname: '/driver/payment',
                    query: { ticketId: t.id },
                  }}
                >
                  <Button size="sm">Pay Now</Button>
                </Link>
              )}
              {(t.status === 'NEW' || t.status === 'ISSUED') && (
                <Button variant="ghost" size="sm" onClick={() => onAppeal(t.id)}>
                  Appeal
                </Button>
              )}
            </div>
          </div>
        ))}
        {!mine.length && (
          <div className="py-12 text-center text-[var(--muted-foreground)]">
            No tickets found. Drive safely!
          </div>
        )}
      </div>
    </Shell>
  )
}
