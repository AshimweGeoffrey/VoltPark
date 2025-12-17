'use client'
import { useState } from 'react'
import Shell from '../../ui/Shell'
import { useStore } from '../../core/store'
import type { ParkingZone } from '../../core/types'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { seedDatabase } from '../../../lib/seed'
import { useAuth } from '../../core/auth'
import { useToast } from '../../core/toast'

export default function ConfigPage() {
  const store = useStore()
  const { user } = useAuth()
  const toast = useToast()
  const [seeding, setSeeding] = useState(false)
  const [form, setForm] = useState({
    name: '',
    ratePerHour: 500,
    currency: 'RWF',
    location: 'Kigali',
    isActive: true,
  })

  const handleSeed = async () => {
    if (!user) return
    if (!confirm('This will add sample data to your database. Continue?'))
      return

    setSeeding(true)
    try {
      await seedDatabase(user.id)
      toast.success('Database populated successfully!')
      await store.refresh()
    } catch (e) {
      console.error(e)
      toast.error('Failed to populate database')
    } finally {
      setSeeding(false)
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) return
    await store.addZone({ ...form })
    setForm({
      name: '',
      ratePerHour: 500,
      currency: 'RWF',
      location: 'Kigali',
      isActive: true,
    })
  }

  const onEdit = (z: ParkingZone, patch: Partial<ParkingZone>) =>
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
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <div className="flex gap-4">
              <Button type="submit">Add</Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSeed}
                disabled={seeding}
                className="border-dashed border-2"
              >
                {seeding ? 'Populating...' : 'Populate Sample Data'}
              </Button>
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
                  <th className="pb-4">Location</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/30">
                {store.zones.map((z) => (
                  <tr key={z.id} className="group">
                    <td className="py-4 pl-2 font-medium">{z.name}</td>
                    <td className="py-4">
                      {z.ratePerHour} {z.currency}
                    </td>
                    <td className="py-4">{z.location}</td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          z.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {z.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => store.removeZone(z.id)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Shell>
  )
}
