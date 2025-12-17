'use client'
import { useEffect, useMemo, useState } from 'react'
import Shell from '../../ui/Shell'
import { useStore } from '../../core/store'
import { useAuth } from '../../core/auth'
import { nowISO } from '../../core/utils'
import { Button } from '../../ui/Button'

export default function SessionTracker() {
  const { user } = useAuth()
  const store = useStore()

  useEffect(() => {
    store.seed()
  }, [])

  const driver = store.users.find((u) => u.id === user?.id)
  const myVehicles = store.vehicles.filter((v) => v.ownerId === user?.id)
  const vehicle = myVehicles[0]
  const vehicleId = vehicle?.id

  const [zoneId, setZoneId] = useState('')
  const [minutes, setMinutes] = useState(60)
  const [newPlate, setNewPlate] = useState('')
  const [addingVehicle, setAddingVehicle] = useState(false)

  useEffect(() => {
    if (store.zones.length > 0 && !zoneId) {
      setZoneId(store.zones[0].id)
    }
  }, [store.zones, zoneId])

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
    () =>
      active && active.endTime
        ? Math.floor((new Date(active.endTime).getTime() - Date.now()) / 60000)
        : 0,
    [active, tick]
  )

  const handleAddVehicle = async () => {
    if (!newPlate) return
    const success = await store.addVehicle(newPlate, 'CAR')
    if (success) {
      setAddingVehicle(false)
    } else {
      alert('Failed to add vehicle. Please check console for details.')
    }
  }

  const start = async () => {
    if (!driver || !zoneId || !vehicleId) return
    const startTime = nowISO()
    const endTime = new Date(Date.now() + minutes * 60000).toISOString()

    await store.startSession({
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

  const close = async () => {
    if (active) await store.closeSession(active.id)
  }

  if (!vehicleId && !addingVehicle) {
    return (
      <Shell
        title="Parking Session"
        nav={[
          { label: 'Home', href: '/driver', icon: 'home' },
          { label: 'Session', href: '/driver/session', icon: 'session' },
          { label: 'Tickets', href: '/driver/tickets', icon: 'tickets' },
        ]}
      >
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-4">No Vehicle Found</h2>
          <p className="mb-6 text-[var(--muted-foreground)]">
            Please add a vehicle to start parking.
          </p>
          <Button onClick={() => setAddingVehicle(true)}>Add Vehicle</Button>
        </div>
      </Shell>
    )
  }

  if (addingVehicle) {
    return (
      <Shell
        title="Add Vehicle"
        nav={[
          { label: 'Home', href: '/driver', icon: 'home' },
          { label: 'Session', href: '/driver/session', icon: 'session' },
          { label: 'Tickets', href: '/driver/tickets', icon: 'tickets' },
        ]}
      >
        <div className="max-w-md mx-auto p-6 bg-[var(--background)] rounded-xl border border-[var(--border)] shadow-sm">
          <h2 className="text-xl font-bold mb-4">Add Vehicle</h2>
          <div className="space-y-4">
            <input
              className="w-full p-3 border border-[var(--border)] rounded-lg bg-[var(--background)]"
              placeholder="License Plate (e.g. RAA 123 A)"
              value={newPlate}
              onChange={(e) => setNewPlate(e.target.value)}
            />
            <div className="flex gap-4">
              <Button onClick={handleAddVehicle}>Save Vehicle</Button>
              <Button variant="ghost" onClick={() => setAddingVehicle(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell
      title="Parking Session"
      nav={[
        { label: 'Home', href: '/driver', icon: 'home' },
        { label: 'Session', href: '/driver/session', icon: 'session' },
        { label: 'Tickets', href: '/driver/tickets', icon: 'tickets' },
      ]}
    >
      <div className="max-w-md mx-auto space-y-8">
        {/* Active Session Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-8 text-white shadow-2xl shadow-indigo-500/30">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

          <div className="relative z-10 text-center">
            <div className="mb-2 text-sm font-medium uppercase tracking-wider opacity-80">
              {active ? 'Time Remaining' : 'Start New Session'}
            </div>
            <div className="text-6xl font-bold tracking-tighter mb-2">
              {active ? (
                <span>
                  {remaining > 0 ? remaining : 0}
                  <span className="text-2xl ml-2">min</span>
                </span>
              ) : (
                <span>
                  --<span className="text-2xl ml-2">min</span>
                </span>
              )}
            </div>
            {active && remaining <= 0 && (
              <div className="mb-4 rounded-full bg-red-500/20 px-3 py-1 text-sm font-bold text-red-200">
                Expired
              </div>
            )}
            <div className="text-sm opacity-80">
              {active
                ? `Zone: ${
                    store.zones.find((z) => z.id === active.zoneId)?.name
                  }`
                : `Vehicle: ${vehicle?.plateNumber}`}
            </div>
          </div>
        </div>

        {/* Controls */}
        {!active ? (
          <div className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Select Zone
              </label>
              <div className="relative">
                <select
                  className="flex h-12 w-full appearance-none rounded-lg bg-[var(--background)] px-4 py-2 text-base shadow-sm ring-1 ring-[var(--border)]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                >
                  {store.zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.ratePerHour} RWF/hr)
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Duration
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="15"
                  max="240"
                  step="15"
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-[var(--secondary)] accent-[var(--primary)]"
                />
                <span className="w-16 text-right font-bold text-[var(--foreground)]">
                  {minutes}m
                </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="mb-4 flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">
                  Estimated Cost
                </span>
                <span className="font-bold text-[var(--foreground)]">
                  {store.zones.find((z) => z.id === zoneId)?.ratePerHour
                    ? (
                        (store.zones.find((z) => z.id === zoneId)!.ratePerHour *
                          minutes) /
                        60
                      ).toFixed(0)
                    : 0}{' '}
                  RWF
                </span>
              </div>
              <Button
                onClick={start}
                className="w-full py-6 text-lg shadow-lg shadow-[var(--primary)]/25"
              >
                Start Parking
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={close}
              variant="destructive"
              className="w-full py-6 text-lg shadow-lg shadow-red-500/25"
            >
              End Session
            </Button>
            <Button variant="ghost" className="w-full">
              Extend Session
            </Button>
          </div>
        )}
      </div>
    </Shell>
  )
}
