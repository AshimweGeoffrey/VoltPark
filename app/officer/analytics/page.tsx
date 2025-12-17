'use client'
import { useStore } from '../../core/store'
import Shell from '../../ui/Shell'

export default function OfficerAnalytics() {
  const store = useStore()
  
  const activeSessions = store.sessions.filter(s => s.status === 'ACTIVE').length
  const pendingTickets = store.tickets.filter(t => t.status === 'PENDING').length
  
  const today = new Date().toISOString().split('T')[0]
  const ticketsToday = store.tickets.filter(t => t.createdAt.startsWith(today)).length
  const revenueToday = store.payments
    .filter(p => p.processedAt.startsWith(today))
    .reduce((acc, p) => acc + p.amount, 0)

  return (
    <Shell
      title="Analytics Overview"
      toolbar={['Report Violation', 'Vehicle Hold', 'Record Offense']}
      actions={[{ label: 'Export Report', href: '#' }]}
      nav={[
        { label: 'Dashboard', href: '/officer', icon: 'home' },
        { label: 'Enforcement', href: '/officer/enforcement', icon: 'violation' },
        { label: 'Analytics', href: '/officer/analytics', icon: 'analytics' },
        { label: 'Sales & Revenue', href: '/officer/sales', icon: 'payment' },
      ]}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl border border-[var(--border)] bg-card">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)]">
              Active Sessions
            </h3>
            <p className="text-3xl font-bold mt-2">{activeSessions}</p>
          </div>
          <div className="p-6 rounded-xl border border-[var(--border)] bg-card">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)]">
              Pending Tickets
            </h3>
            <p className="text-3xl font-bold mt-2">{pendingTickets}</p>
          </div>
          <div className="p-6 rounded-xl border border-[var(--border)] bg-card">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)]">
              Tickets Issued Today
            </h3>
            <p className="text-3xl font-bold mt-2">{ticketsToday}</p>
          </div>
          <div className="p-6 rounded-xl border border-[var(--border)] bg-card">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)]">
              Revenue Today
            </h3>
            <p className="text-3xl font-bold mt-2">RWF {revenueToday.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Shell>
  )
}
