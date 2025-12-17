'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import Shell from '../../ui/Shell'
import { useStore } from '../../core/store'
import { useAuth } from '../../core/auth'
import { money } from '../../core/utils'
import { Button } from '../../ui/Button'

export default function TicketsPage() {
  const { user } = useAuth()
  const store = useStore()

  useEffect(() => {
    store.seed()
  }, [])

  const myVehicles = store.vehicles.filter((v) => v.ownerId === user?.id)
  const myVehicleIds = myVehicles.map((v) => v.id)

  const mine = store.tickets.filter(
    (t) => t.vehicleId && myVehicleIds.includes(t.vehicleId)
  )

  return (
    <Shell
      title="My Tickets"
      nav={[
        { label: 'Home', href: '/driver', icon: 'home' },
        { label: 'Session', href: '/driver/session', icon: 'session' },
        { label: 'Tickets', href: '/driver/tickets', icon: 'tickets' },
      ]}
    >
      <div className="space-y-4">
        {mine.length === 0 && (
          <div className="text-center py-12 text-[var(--muted-foreground)]">
            No tickets found. Great job!
          </div>
        )}
        {mine.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-card p-6 shadow-sm"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-lg">{money(t.fineAmount)}</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                    t.status === 'PAID'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {t.status}
                </span>
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">
                {t.reason} • {new Date(t.createdAt).toLocaleDateString()}
              </div>
            </div>
            {t.status === 'PENDING' && (
              <Link href={`/driver/payment?ticketId=${t.id}`}>
                <Button variant="outline">Pay Now</Button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </Shell>
  )
}
