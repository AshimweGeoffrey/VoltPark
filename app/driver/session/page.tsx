'use client'
import { useEffect, useMemo, useState } from 'react'
import Shell from '../../ui/Shell'
import { useStore } from '../../core/store'
import { nowISO } from '../../core/utils'
import { Button } from '../../ui/Button'

export default function SessionTracker() {
  const store = useStore()
  useEffect(() => {
    store.seed()
  }, [])

  const driver = store.users.find((u) => u.role === 'DRIVER')
  const [zoneId, setZoneId] = useState(store.zones[0]?.id ?? '')
  const [plate, setPlate] = useState('RAA 123 A')
  const [minutes, setMinutes] = useState(60)

  // Mock vehicle ID for the driver
  const vehicleId = 'veh_diane_1'

  const active = store.sessions.find(
    (s) => s.status === 'ACTIVE' && s.vehicleId === vehicleId
  )

  // countdown
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])
  
  const remaining = useMemo(
    () => (active && active.endTime ? Math.floor((new Date(active.endTime).getTime() - Date.now()) / 60000) : 0),
    [active, tick]
  )

  const start = () => {
    if (!driver || !zoneId) return
    const startTime = nowISO()
    const endTime = new Date(Date.now() + minutes * 60000).toISOString()
    
    store.startSession({
      vehicleId,
      zoneId,
      entryMethod: 'MANUAL',
      startTime,
      endTime,
      entryImageUrl: null,
      deviceId: null,
    })
    store.notify({
      userId: driver.id,
      title: 'Session started',
      message: `Zone set to ${store.zones.find((z) => z.id === zoneId)?.name}`,
    })
  }

  const close = () => {
    if (active) store.closeSession(active.id)
  }

  const notifications = store.notifications.filter(
    (n) => n.userId === driver?.id
  )

  return (
    <Shell
      title="Session"
      notifications={notifications}
      onMarkRead={store.markRead}
      nav={[
        { label: 'Home', href: '/driver', icon: 'home' },
        { label: 'Session', href: '/driver/session', icon: 'session' },
        { label: 'Tickets', href: '/driver/tickets', icon: 'tickets' },
      ]}
    >
      <div className="grid gap-6 sm:max-w-md">
        {!active && (
          <div className="rounded-xl bg-[var(--background)] p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
              Start Parking Session
            </h2>
            <div className="grid gap-6">
              <div className="relative">
                <select
                  className="flex h-12 w-full appearance-none rounded-lg bg-[var(--background)] px-4 py-2 text-base shadow-sm ring-1 ring-[var(--border)]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                >
                  {store.zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} — {z.currency} {z.ratePerHour}/hr
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--muted-foreground)]">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--muted-foreground)]">
                  Duration
                </label>
                <div className="flex gap-2">
                  {[30, 60, 120].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMinutes(m)}
                      className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                        minutes === m
                          ? 'bg-[var(--primary)] text-white shadow-md'
                          : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>

              <Button size="lg" onClick={start} className="w-full">
                Start Session
              </Button>
            </div>
          </div>
        )}

        {active && (
          <div className="rounded-xl bg-[var(--background)] p-8 shadow-sm text-center space-y-6">
            <div className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-100">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">
                  {remaining}
                </div>
                <div className="text-sm font-medium text-green-600/80">
                  minutes left
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Active Session</h3>
              <p className="text-[var(--muted-foreground)]">
                {store.zones.find((z) => z.id === active.zoneId)?.name}
              </p>
            </div>
            <Button variant="outline" size="lg" onClick={close} className="w-full">
              End Session
            </Button>
          </div>
        )}
      </div>
    </Shell>
  )
}
