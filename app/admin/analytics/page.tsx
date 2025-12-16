'use client'
import { useMemo } from 'react'
import { useStore } from '../../core/store'
import { money } from '../../core/utils'
import Shell from '../../ui/Shell'

export default function AnalyticsPage() {
  const store = useStore()

  const revenue = useMemo(
    () => store.payments.reduce((a, p) => a + p.amount, 0),
    [store.payments]
  )
  const byZone = useMemo(() => {
    const map: Record<string, number> = {}
    store.tickets.forEach((t) => {
      map[t.zoneId] = (map[t.zoneId] ?? 0) + 1
    })
    return map
  }, [store.tickets])

  const occupancy = useMemo(() => {
    const total = store.sessions.filter((s) => s.status === 'ACTIVE').length
    const map: Record<string, number> = {}
    store.zones.forEach((z) => {
      map[z.id] = 0
    })
    store.sessions
      .filter((s) => s.status === 'ACTIVE')
      .forEach((s) => {
        map[s.zoneId] = (map[s.zoneId] ?? 0) + 1
      })
    // scale to percentage assuming 10 slots per zone (demo)
    Object.keys(map).forEach((k) => {
      map[k] = Math.min(100, Math.round((map[k] / 10) * 100))
    })
    return { map, total }
  }, [store.sessions, store.zones])

  return (
    <Shell
      title="Analytics"
      nav={[
        { label: 'Home', href: '/admin', icon: 'home' },
        { label: 'System Config', href: '/admin/config', icon: 'config' },
        { label: 'Users', href: '/admin/users', icon: 'users' },
        { label: 'Analytics', href: '/admin/analytics', icon: 'analytics' },
      ]}
    >
      <div className="grid gap-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Stat title="Total Revenue" value={money(revenue)} />
          <Stat title="Tickets Issued" value={String(store.tickets.length)} />
          <Stat title="Active Sessions" value={String(occupancy.total)} />
        </div>

        <div className="rounded-xl bg-[var(--background)] p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
            Violation Frequency by Zone
          </h2>
          <BarChart
            labels={store.zones.map((z) => z.name)}
            values={store.zones.map((z) => byZone[z.id] ?? 0)}
          />
        </div>

        <div className="rounded-xl bg-[var(--background)] p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">Occupancy Rate</h2>
          <BarChart
            labels={store.zones.map((z) => z.name)}
            values={store.zones.map((z) => occupancy.map[z.id] ?? 0)}
            suffix="%"
            max={100}
          />
        </div>
      </div>
    </Shell>
  )
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--background)] p-6 shadow-sm border-l-4 border-[var(--primary)]">
      <div className="text-sm font-medium text-[var(--muted-foreground)]">{title}</div>
      <div className="mt-2 text-3xl font-bold text-[var(--foreground)]">{value}</div>
    </div>
  )
}

function BarChart({
  labels,
  values,
  suffix = '',
  max,
}: {
  labels: string[]
  values: number[]
  suffix?: string
  max?: number
}) {
  const peak = max ?? Math.max(1, ...values)
  return (
    <div className="space-y-4">
      {labels.map((l, i) => {
        const v = values[i] ?? 0
        const pct = Math.round((v / peak) * 100)
        return (
          <div key={l} className="grid grid-cols-5 items-center gap-4 text-base">
            <div className="col-span-1 truncate font-medium text-[var(--muted-foreground)]">{l}</div>
            <div className="col-span-4 h-4 rounded-full bg-[var(--muted)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
      {labels.length === 0 && (
        <div className="text-center text-[var(--muted-foreground)]">No data available</div>
      )}
    </div>
  )
}
