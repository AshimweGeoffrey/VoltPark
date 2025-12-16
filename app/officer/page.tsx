'use client'
import Link from 'next/link'
import Shell from '../ui/Shell'

export default function OfficerDashboard() {
  return (
    <Shell
      title="Officer Dashboard"
      toolbar={['Report Violation', 'Vehicle Hold', 'Record Offense']}
      actions={[{ label: 'Issue Ticket', href: '/officer/enforcement' }]}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Analytics Card */}
        <Link href="/officer/analytics" className="group">
          <div className="h-full p-6 rounded-xl border border-[var(--border)] bg-card hover:shadow-lg transition-all group-hover:border-[var(--primary)]">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-[var(--muted-foreground)]">
              View parking occupancy, peak hours, and enforcement statistics.
            </p>
          </div>
        </Link>

        {/* Sales Card */}
        <Link href="/officer/sales" className="group">
          <div className="h-full p-6 rounded-xl border border-[var(--border)] bg-card hover:shadow-lg transition-all group-hover:border-[var(--primary)]">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <svg
                className="w-6 h-6 text-green-600"
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
            </div>
            <h2 className="text-xl font-semibold mb-2">Sales & Revenue</h2>
            <p className="text-[var(--muted-foreground)]">
              Track daily revenue, ticket payments, and permit sales.
            </p>
          </div>
        </Link>

        {/* Enforcement Card */}
        <Link href="/officer/enforcement" className="group">
          <div className="h-full p-6 rounded-xl border border-[var(--border)] bg-card hover:shadow-lg transition-all group-hover:border-[var(--primary)]">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Parking Enforcement</h2>
            <p className="text-[var(--muted-foreground)]">
              Issue tickets, check vehicle status, and manage violations.
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
        <div className="bg-card border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] bg-[var(--muted)]/50">
            <div className="grid grid-cols-4 font-medium text-sm text-[var(--muted-foreground)]">
              <div>Time</div>
              <div>Action</div>
              <div>Location</div>
              <div>Status</div>
            </div>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-4 grid grid-cols-4 text-sm hover:bg-[var(--muted)]/20 transition-colors"
              >
                <div className="text-[var(--muted-foreground)]">
                  10:{15 + i} AM
                </div>
                <div className="font-medium">Ticket Issued #{2000 + i}</div>
                <div>Kigali Heights - Level {i}</div>
                <div className="text-green-600 font-medium">Completed</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  )
}
