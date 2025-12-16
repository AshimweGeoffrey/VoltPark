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
    (t) => t.status === 'ISSUED' || t.status === 'NEW'
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
          color="bg-[var(--secondary)] border-[var(--primary)]/20"
        />
      </div>

      <div className="mt-2 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Overview Card */}
        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 border border-[var(--border)] lg:col-span-2 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h3 className="font-bold text-2xl text-[var(--foreground)]">
                Live Overview
              </h3>
              <p className="text-[var(--muted-foreground)]">
                Real-time parking occupancy
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-[var(--border)] px-4 py-1.5 text-sm font-semibold text-[var(--foreground)] shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              Live Updates
            </div>
          </div>

          <div className="relative h-80 w-full overflow-hidden rounded-2xl shadow-inner border border-[var(--border)]">
            <Image
              src="https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=2000&auto=format&fit=crop"
              alt="Kigali Map"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/20 to-transparent pointer-events-none" />

            {/* Floating Markers */}
            <div className="absolute top-1/4 left-1/4 p-2 bg-white rounded-lg shadow-lg animate-bounce duration-[3000ms]">
              <div className="text-xs font-bold text-[var(--foreground)]">
                Kigali Heights
              </div>
              <div className="text-[10px] text-green-600 font-bold">
                85% Free
              </div>
            </div>
            <div className="absolute bottom-1/3 right-1/3 p-2 bg-white rounded-lg shadow-lg animate-bounce duration-[4000ms]">
              <div className="text-xs font-bold text-[var(--foreground)]">
                CHIC
              </div>
              <div className="text-[10px] text-amber-600 font-bold">
                40% Free
              </div>
            </div>
          </div>
        </div>

        {/* Zones List */}
        <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 border border-[var(--border)] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl text-[var(--foreground)]">
              Zones
            </h3>
            <Link
              href="/admin/config"
              className="text-sm font-medium text-[var(--primary)] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {store.zones.map((z) => (
              <div
                key={z.id}
                className="group flex items-center justify-between rounded-2xl p-4 bg-[var(--muted)] border border-transparent hover:border-[var(--primary)]/20 hover:bg-white hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white border border-[var(--border)] flex items-center justify-center text-[var(--primary)] font-bold shadow-sm group-hover:scale-110 transition-transform">
                    {z.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-[var(--foreground)]">
                      {z.name}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {z.maxHours}h Limit
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[var(--foreground)]">
                    RWF {z.ratePerHour}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    /hr
                  </div>
                </div>
              </div>
            ))}
            <Link href="/admin/config">
              <button className="w-full py-3 mt-2 rounded-xl border-2 border-dashed border-[var(--border)] text-[var(--muted-foreground)] font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">
                + Add New Zone
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Tickets Table */}
      <div className="mt-8 rounded-3xl bg-white shadow-xl shadow-slate-200/50 border border-[var(--border)] overflow-hidden">
        <div className="p-8 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-bold text-xl text-[var(--foreground)]">
            Recent Tickets
          </h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              Filter
            </Button>
            <Button variant="ghost" size="sm">
              Export
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--muted)]/50 text-[var(--muted-foreground)] font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="py-4 px-6 text-left">Ticket ID</th>
                <th className="py-4 px-6 text-left">Driver</th>
                <th className="py-4 px-6 text-left">Amount</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {store.tickets.slice(0, 5).map((t) => (
                <tr
                  key={t.id}
                  className="group hover:bg-[var(--muted)]/30 transition-colors"
                >
                  <td className="py-4 px-6 font-mono font-medium text-[var(--primary)]">
                    #{t.id.slice(-6)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                        {store.users
                          .find((u) => u.id === t.driverId)
                          ?.name.charAt(0) || 'U'}
                      </div>
                      <span className="font-medium text-[var(--foreground)]">
                        {store.users.find((u) => u.id === t.driverId)?.name ||
                          'Unknown Driver'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-[var(--foreground)]">
                    {money(t.amount)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                        t.status === 'PAID'
                          ? 'bg-green-100 text-green-700'
                          : t.status === 'ISSUED'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
              {!store.tickets.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-[var(--muted-foreground)]"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="h-10 w-10 text-[var(--border)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                      No tickets issued yet
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
  trend?: string
  trendDown?: boolean
  icon?: React.ReactNode
  color?: string
}) {
  return (
    <div
      className={`rounded-3xl p-6 shadow-lg shadow-slate-200/50 border transition-all hover:-translate-y-1 ${
        color || 'bg-white border-[var(--border)]'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-2xl bg-white shadow-sm border border-[var(--border)]/50">
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-bold ${
              trendDown ? 'text-red-500' : 'text-emerald-600'
            }`}
          >
            {trendDown ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            )}
            {trend}
          </div>
        )}
      </div>
      <div className="text-sm font-medium text-[var(--muted-foreground)] mb-1">
        {title}
      </div>
      <div className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
        {value}
      </div>
    </div>
  )
}
