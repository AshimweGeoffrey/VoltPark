'use client'
import { useState } from 'react'
import Shell from '../../ui/Shell'
import { useStore } from '../../core/store'
import type { ParkingZoneRule } from '../../core/types'
import { Button } from '../../ui/Button'

export default function ConfigPage() {
  const store = useStore()
  const [form, setForm] = useState({
    name: '',
    ratePerHour: 500,
    maxHours: 2,
    fineAmount: 10000,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) return
    store.addZone({ ...form })
    setForm({ name: '', ratePerHour: 500, maxHours: 2, fineAmount: 10000 })
  }

  const onEdit = (z: ParkingZoneRule, patch: Partial<ParkingZoneRule>) =>
    store.updateZone({ ...z, ...patch })

  return (
    <Shell
      title="System Configuration"
      nav={[
        { label: 'Home', href: '/admin', icon: 'home' },
        { label: 'System Config', href: '/admin/config', icon: 'config' },
        { label: 'Users', href: '/admin/users', icon: 'users' },
        { label: 'Analytics', href: '/admin/analytics', icon: 'analytics' },
      ]}
    >
      <div className="grid gap-8">
        <div className="rounded-xl bg-[var(--background)] p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
            Create Parking Zone Rule
          </h2>
          <form
            onSubmit={submit}
            className="grid grid-cols-1 gap-6 sm:grid-cols-4"
          >
            <Input
              placeholder="Zone name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              type="number"
              step="100"
              placeholder="Rate/hr (RWF)"
              value={form.ratePerHour}
              onChange={(e) =>
                setForm({ ...form, ratePerHour: Number(e.target.value) })
              }
            />
            <Input
              type="number"
              placeholder="Max hours"
              value={form.maxHours}
              onChange={(e) =>
                setForm({ ...form, maxHours: Number(e.target.value) })
              }
            />
            <div className="flex gap-4">
              <Input
                type="number"
                step="1000"
                placeholder="Fine amount (RWF)"
                value={form.fineAmount}
                onChange={(e) =>
                  setForm({ ...form, fineAmount: Number(e.target.value) })
                }
              />
              <Button type="submit">Add</Button>
            </div>
          </form>
        </div>

        <div className="rounded-xl bg-[var(--background)] p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
            Parking Zones
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-base">
              <thead className="text-[var(--muted-foreground)] font-medium">
                <tr>
                  <th className="pb-4 pl-2">Name</th>
                  <th className="pb-4">Rate/hr</th>
                  <th className="pb-4">Max (h)</th>
                  <th className="pb-4">Fine</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/30">
                {store.zones.map((z) => (
                  <tr key={z.id} className="group">
                    <td className="py-4 pl-2 font-medium">{z.name}</td>
                    <td className="py-4">
                      <Input
                        type="number"
                        className="h-9 w-20"
                        value={z.ratePerHour}
                        onChange={(e) =>
                          onEdit(z, { ratePerHour: Number(e.target.value) })
                        }
                      />
                    </td>
                    <td className="py-4">
                      <Input
                        type="number"
                        className="h-9 w-20"
                        value={z.maxHours}
                        onChange={(e) =>
                          onEdit(z, { maxHours: Number(e.target.value) })
                        }
                      />
                    </td>
                    <td className="py-4">
                      <Input
                        type="number"
                        className="h-9 w-20"
                        value={z.fineAmount}
                        onChange={(e) =>
                          onEdit(z, { fineAmount: Number(e.target.value) })
                        }
                      />
                    </td>
                    <td className="py-4 text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => store.removeZone(z.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {store.zones.length === 0 && (
              <div className="py-8 text-center text-[var(--muted-foreground)]">
                No zones configured. Add one above.
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`flex h-12 w-full rounded-lg bg-[var(--background)] px-4 py-2 text-base shadow-sm ring-1 ring-[var(--border)]/50 transition-all placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
        props.className || ''
      }`}
    />
  )
}
