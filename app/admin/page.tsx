'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import Shell from '../ui/Shell'
import { useStore } from '../core/store'
import { money } from '../core/utils'
import { Button } from '../ui/Button'

export default function AdminHome() {
  const store = useStore()
  useEffect(() => {
    store.seed()
  }, [])

  const revenue = store.payments.reduce((a, p) => a + p.amount, 0)
  const openTickets = store.tickets.filter(
    (t) => t.status === 'PENDING'
  ).length
  const activeSessions = store.sessions.filter(
    (s) => s.status === 'ACTIVE'
  ).length

  return (
    <Shell
      title="Dashboard"
      toolbar={[
        'Start Parking',
        'Issue Ticket',
        'Adjust Zone',
        'Upload Signage',
        'Create Report',
      ]}
      actions={[
        { label: 'New Zone', href: '/admin/config' },
        { label: 'Analytics', href: '/admin/analytics' },
      ]}
      nav={[
        { label: 'Home', href: '/admin', icon: 'home' },
        { label: 'System Config', href: '/admin/config', icon: 'config' },
        { label: 'Users', href: '/admin/users', icon: 'users' },
        { label: 'Analytics', href: '/admin/analytics', icon: 'analytics' },
      ]}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Stat
          title="Total Revenue"
          value={money(revenue)}
          trend="+12.5%"
          icon={
            <svg
              className="h-6 w-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="bg-emerald-50 border-emerald-100"
        />
        <Stat
          title="Open Tickets"
          value={String(openTickets)}
          trend="-2.1%"
          trendDown
          icon={
            <svg
              className="h-6 w-6 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v22m0-2h2m-2 0H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          color="bg-amber-50 border-amber-100"
        />
        <Stat
          title="Active Sessions"
          value={String(activeSessions)}
          trend="+5.3%"
          icon={
            <svg
              className="h-6 w-6 text-[var(--primary)]"
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
          }
          color="bg-indigo-50 border-indigo-100"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="rounded-xl border border-[var(--border)] bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Violations</h3>
          <div className="space-y-4">
            {store.tickets.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--background)]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs">
                    VIO
                  </div>
                  <div>
                    <p className="font-medium">Ticket {t.id.slice(-4)}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {t.violationType}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold">{money(t.fineAmount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Live Zone Status</h3>
          <div className="space-y-4">
            {store.zones.map((z) => (
              <div
                key={z.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--background)]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <div>
                    <p className="font-medium">{z.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {z.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{z.currency} {z.ratePerHour}/hr</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Active
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  )
}

function Stat({
  title,
  value,
  trend,
  trendDown,
  icon,
  color,
}: {
  title: string
  value: string
  trend: string
  trendDown?: boolean
  icon: React.ReactNode
  color: string
}) {
  return (
    <div
      className={`rounded-xl border p-6 transition-all hover:shadow-md ${color}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-white/60 backdrop-blur-sm">
          {icon}
        </div>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${
            trendDown
              ? 'bg-red-100 text-red-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {trend}
        </span>
      </div>
      <h3 className="text-sm font-medium text-[var(--muted-foreground)]">
        {title}
      </h3>
      <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
        {value}
      </p>
    </div>
  )
}
