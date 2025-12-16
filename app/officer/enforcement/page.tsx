'use client'
import Shell from '../../ui/Shell'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'

export default function OfficerEnforcement() {
  return (
    <Shell
      title="Enforcement"
      toolbar={['Report Violation', 'Vehicle Hold', 'Record Offense']}
      actions={[]}
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
        {/* Lookup Section */}
        <div className="p-6 rounded-xl border border-[var(--border)] bg-card space-y-6">
          <h2 className="text-xl font-semibold">Vehicle Lookup</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter License Plate (e.g., RAA 123 A)"
                className="h-12 text-lg"
              />
            </div>
            <Button className="h-12 px-8">Search</Button>
          </div>
        </div>

        {/* Active Violations List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Reported Violations (Nearby)
          </h2>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-[var(--border)] bg-card flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold uppercase">
                    Expired Meter
                  </span>
                  <span className="text-sm text-[var(--muted-foreground)]">
                    Kigali Heights - Spot {100 + i}
                  </span>
                </div>
                <p className="font-medium text-lg">RAA {123 + i} A</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Reported 5 mins ago
                </p>
              </div>
              <Button variant="outline">Process</Button>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}
