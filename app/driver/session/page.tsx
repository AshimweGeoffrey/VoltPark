'use client'
import { useEffect, useMemo, useState } from 'react'
import Shell from '../../ui/Shell'
import { useStore } from '../../core/store'
import { minutesUntil, nowISO } from '../../core/utils'
import { Button } from '../../ui/Button'

export default function SessionTracker() {
  const store = useStore()
  useEffect(() => {
    store.seed()
  }, [])

  const driver = store.users.find((u) => u.role === 'DRIVER')
  const [zoneId, setZoneId] = useState(store.zones[0]?.id ?? '')
  const [plate, setPlate] = useState('EV-1234')
  const [minutes, setMinutes] = useState(60)

  const active = store.sessions.find(
    (s) => s.status === 'ACTIVE' && s.driverId === driver?.id
  )

  // countdown
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const remaining = useMemo(
    () => (active ? minutesUntil(active.entryTime, active.paidMinutes) : 0),
    [active, tick]
  )

  const start = () => {
    if (!driver || !zoneId) return
    store.startSession({
      driverId: driver.id,
      zoneId,
      vehiclePlate: plate,
      entryTime: nowISO(),
      paidMinutes: minutes,
    })
    store.notify({
      driverId: driver.id,
      title: 'Session started',
      body: `Zone set to ${store.zones.find((z) => z.id === zoneId)?.name}`,
    })
  }

  const close = () => {
    if (active) store.closeSession(active.id)
  }

  return (
    <Shell
      title="Session"
      nav={[
        { label: 'Home', href: '/driver', icon: 'home' },
        { label: 'Session', href: '/driver/session', icon: 'session' },
        { label: 'Tickets', href: '/driver/tickets', icon: 'tickets' },
        { label: 'Notifications', href: '/driver/notifications', icon: 'bell' },
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
                      {z.name} — ${z.ratePerHour}/hr
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--muted-foreground)]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <Input
                placeholder="Vehicle plate"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
              />
              <Input
                type="number"
                min={15}
                step={15}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
              />
              <Button onClick={start} className="w-full">
                Start Session
              </Button>
            </div>
          </div>
        )}

        {active && (
          <div className="rounded-xl bg-[var(--background)] p-8 shadow-sm border-l-4 border-[var(--primary)]">
            <div className="mb-2 text-sm font-medium text-[var(--muted-foreground)]">
              Time Remaining
            </div>
            <div className="text-5xl font-bold text-[var(--foreground)]">
              {remaining}m
            </div>
            <div className="mt-6 grid gap-2 text-base text-[var(--muted-foreground)]">
              <div className="flex justify-between">
                <span>Zone</span>
                <span className="font-medium text-[var(--foreground)]">
                  {store.zones.find((z) => z.id === active.zoneId)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Plate</span>
                <span className="font-medium text-[var(--foreground)]">
                  {active.vehiclePlate}
                </span>
              </div>
            </div>
            <div className="mt-8">
              <Button
                variant="destructive"
                className="w-full"
                onClick={close}
              >
                End Session
              </Button>
            </div>
          </div>
        )}
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
