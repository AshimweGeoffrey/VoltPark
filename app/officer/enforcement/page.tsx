import Link from 'next/link'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'

export default function OfficerEnforcement() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">
              Enforcement
            </h1>
            <p className="text-[var(--muted-foreground)]">
              Issue tickets and verify vehicle status.
            </p>
          </div>
        </div>

        {/* Lookup Section */}
        <div className="p-6 rounded-xl border border-[var(--border)] bg-card space-y-6">
          <h2 className="text-xl font-semibold">Vehicle Lookup</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter License Plate (e.g., ABC-1234)"
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
                    Zone A - Spot {100 + i}
                  </span>
                </div>
                <h3 className="text-lg font-bold">Toyota Camry - Silver</h3>
                <p className="font-mono text-[var(--muted-foreground)]">
                  LPN: XYZ-98{i}
                </p>
              </div>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Issue Ticket
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
