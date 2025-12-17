'use client'
import { useState } from 'react'
import { useStore } from '../../core/store'
import { useAuth } from '../../core/auth'
import Shell from '../../ui/Shell'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'

export default function OfficerEnforcement() {
  const store = useStore()
  const { user } = useAuth()
  const [plate, setPlate] = useState('')
  const [searchResult, setSearchResult] = useState<{
    vehicle: any
    session: any
    tickets: any[]
  } | null>(null)

  const search = () => {
    const v = store.vehicles.find(
      (v) => v.plateNumber.toUpperCase() === plate.toUpperCase()
    )
    if (!v) {
      setSearchResult(null)
      return
    }
    const s = store.sessions.find(
      (s) => s.vehicleId === v.id && s.status === 'ACTIVE'
    )
    const t = store.tickets.filter((t) => t.vehicleId === v.id)
    setSearchResult({ vehicle: v, session: s, tickets: t })
  }

  const issueTicket = async () => {
    if (!searchResult || !user) return
    await store.issueTicket({
      vehicleId: searchResult.vehicle.id,
      zoneId: searchResult.session?.zoneId,
      issuedBy: user.id,
      fineAmount: 5000,
      reason: 'Illegal Parking',
      status: 'PENDING',
    })
    search()
  }

  return (
    <Shell
      title="Enforcement"
      nav={[
        { label: 'Dashboard', href: '/officer', icon: 'home' },
        {
          label: 'Enforcement',
          href: '/officer/enforcement',
          icon: 'violation',
        },
        { label: 'Analytics', href: '/officer/analytics', icon: 'analytics' },
        { label: 'Sales & Revenue', href: '/officer/sales', icon: 'payment' },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="p-6 rounded-xl border border-[var(--border)] bg-card space-y-6">
          <h2 className="text-xl font-semibold">Vehicle Lookup</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter License Plate"
                className="h-12 text-lg"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
              />
            </div>
            <Button className="h-12 px-8" onClick={search}>
              Search
            </Button>
          </div>
        </div>

        {searchResult && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-[var(--border)] bg-card">
              <h3 className="text-lg font-bold mb-4">Vehicle Details</h3>
              <p>Plate: {searchResult.vehicle.plateNumber}</p>
              <p>Type: {searchResult.vehicle.type}</p>
              <div className="mt-4">
                {searchResult.session ? (
                  <div className="text-green-600 font-bold">
                    Active Session in Zone{' '}
                    {
                      store.zones.find(
                        (z) => z.id === searchResult.session.zoneId
                      )?.name
                    }
                  </div>
                ) : (
                  <div className="text-red-600 font-bold">
                    No Active Session
                  </div>
                )}
              </div>
              <div className="mt-6">
                <Button onClick={issueTicket} variant="destructive">
                  Issue Ticket (5000 RWF)
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Ticket History</h3>
              {searchResult.tickets.length === 0 && <p>No tickets found.</p>}
              {searchResult.tickets.map((t) => (
                <div key={t.id} className="p-4 border rounded bg-card">
                  <div className="flex justify-between">
                    <span>{t.reason}</span>
                    <span className="font-bold">{t.fineAmount} RWF</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t.status} - {new Date(t.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Shell>
  )
}
