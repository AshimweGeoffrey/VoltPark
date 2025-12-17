'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import Shell from '../ui/Shell'
import { useStore } from '../core/store'
import { useAuth } from '../core/auth'
import { Button } from '../ui/Button'

const I = {
  session: (
    <svg
      className="h-8 w-8 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  ),
  tickets: (
    <svg
      className="h-8 w-8 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 8h18v8H3z" />
      <path d="M7 8v8" />
      <path d="M17 8v8" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  ),
  bell: (
    <svg
      className="h-8 w-8 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22z" />
      <path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2z" />
    </svg>
  ),
  payment: (
    <svg
      className="h-8 w-8 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
    </svg>
  ),
}

export default function DriverHome() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const store = useStore()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    store.seed()
  }, [])

  if (loading) return <div className="p-8">Loading...</div>
  if (!user) return null

  const notifications = store.notifications.filter(
    (n) => n.userId === user.id
  )

  return (
    <Shell
      title="Welcome Back"
      notifications={notifications}
      onMarkRead={store.markRead}
      actions={[{ label: 'Start Session', href: '/driver/session' }]}
      nav={[
        { label: 'Home', href: '/driver', icon: 'home' },
        { label: 'Session', href: '/driver/session', icon: 'session' },
        { label: 'Tickets', href: '/driver/tickets', icon: 'tickets' },
      ]}
    >
      {/* Status Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[var(--primary)] to-violet-600 p-8 text-white shadow-xl shadow-[var(--primary)]/25 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Good Morning!</h2>
          <p className="text-white/80 text-lg">
            You have {store.sessions.filter(s => s.status === 'ACTIVE' && store.vehicles.some(v => v.id === s.vehicleId && v.ownerId === user.id)).length} active parking sessions.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-8" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Link
          href="/driver/session"
          className="group flex flex-col items-center justify-center gap-4 rounded-2xl bg-[var(--background)] p-6 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] border border-[var(--border)]/50"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-110">
            {I.session}
          </div>
          <span className="font-semibold text-[var(--foreground)]">Park</span>
        </Link>
        <Link
          href="/driver/tickets"
          className="group flex flex-col items-center justify-center gap-4 rounded-2xl bg-[var(--background)] p-6 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] border border-[var(--border)]/50"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500 shadow-lg shadow-rose-500/30 transition-transform group-hover:scale-110">
            {I.tickets}
          </div>
          <span className="font-semibold text-[var(--foreground)]">Tickets</span>
        </Link>
        <Link
          href="/driver/notifications"
          className="group flex flex-col items-center justify-center gap-4 rounded-2xl bg-[var(--background)] p-6 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] border border-[var(--border)]/50"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 shadow-lg shadow-amber-500/30 transition-transform group-hover:scale-110">
            {I.bell}
          </div>
          <span className="font-semibold text-[var(--foreground)]">Alerts</span>
        </Link>
        <Link
          href="/driver/payment"
          className="group flex flex-col items-center justify-center gap-4 rounded-2xl bg-[var(--background)] p-6 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] border border-[var(--border)]/50"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/30 transition-transform group-hover:scale-110">
            {I.payment}
          </div>
          <span className="font-semibold text-[var(--foreground)]">Pay</span>
        </Link>
      </div>
    </Shell>
  )
}
