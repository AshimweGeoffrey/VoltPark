'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import Shell from '../ui/Shell'
import { useStore } from '../core/store'
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
  const store = useStore()
  useEffect(() => {
    store.seed()
  }, [])

  return (
    <Shell
      title="Welcome Back"
      actions={[{ label: 'Start Session', href: '/driver/session' }]}
      nav={[
        { label: 'Home', href: '/driver', icon: 'home' },
        { label: 'Session', href: '/driver/session', icon: 'session' },
        { label: 'Tickets', href: '/driver/tickets', icon: 'tickets' },
        { label: 'Notifications', href: '/driver/notifications', icon: 'bell' },
      ]}
    >
      {/* Status Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[var(--primary)] to-violet-600 p-8 text-white shadow-xl shadow-[var(--primary)]/25 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-black/10 blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
            <span className="font-bold tracking-wide uppercase text-sm opacity-90">
              System Online
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-2">No Active Sessions</h2>
          <p className="text-indigo-100 text-lg max-w-md">
            You are not currently parked in any VoltPark zone in Kigali. Start a
            session to avoid tickets.
          </p>
          <div className="mt-8">
            <Link href="/driver/session">
              <Button className="!bg-white !text-[var(--primary)] hover:bg-indigo-50 border-0 shadow-lg shadow-black/10 font-bold text-lg px-8 h-14 rounded-2xl">
                Start Parking
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Tile
          title="Active Session"
          href="/driver/session"
          action="Open"
          desc="Start or track your parking session."
          icon={I.session}
          color="bg-blue-500"
        />
        <Tile
          title="Tickets"
          href="/driver/tickets"
          action="View"
          desc="Pay or appeal issued tickets."
          icon={I.tickets}
          color="bg-amber-500"
        />
        <Tile
          title="Notifications"
          href="/driver/notifications"
          action="Open"
          desc="Alerts about expiry or violations."
          icon={I.bell}
          color="bg-emerald-500"
        />
        <Tile
          title="Payment Methods"
          href="/driver/payment"
          action="Manage"
          desc="Add or remove cards."
          icon={I.payment}
          color="bg-slate-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 border border-[var(--border)]">
        <h3 className="font-bold text-xl text-[var(--foreground)] mb-6">
          Recent Activity
        </h3>
        <div className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-[var(--border)] last:border-0 last:pb-0">
            <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-bold text-[var(--foreground)]">
                Parking Session Ended
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">
                Kigali Heights • 2 hours ago
              </div>
            </div>
            <div className="font-bold text-[var(--foreground)]">RWF 4,500</div>
          </div>
          <div className="flex items-center gap-4 pb-6 border-b border-[var(--border)] last:border-0 last:pb-0">
            <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-bold text-[var(--foreground)]">
                Payment Successful
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">
                MOMO ending in 8899 • Yesterday
              </div>
            </div>
            <div className="font-bold text-[var(--foreground)]">
              -RWF 12,000
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}

function Tile({
  title,
  desc,
  action,
  href,
  icon,
  color,
}: {
  title: string
  desc: string
  action: string
  href: string
  icon: ReactNode
  color: string
}) {
  return (
    <div className="group flex flex-col justify-between rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/50 border border-[var(--border)] transition-all hover:-translate-y-1 hover:shadow-xl h-full">
      <div>
        <div
          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md ${color}`}
        >
          {icon}
        </div>
        <h3 className="font-bold text-xl text-[var(--foreground)] mb-2">
          {title}
        </h3>
        <p className="text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
      </div>
      <div className="mt-6 pt-6 border-t border-[var(--border)] flex justify-end">
        <Link href={href} className="w-full">
          <Button
            variant="ghost"
            className="w-full justify-between group-hover:bg-[var(--muted)] rounded-xl h-12 text-[var(--foreground)] font-bold"
          >
            {action}
            <svg
              className="w-5 h-5 text-[var(--muted-foreground)] group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  )
}
