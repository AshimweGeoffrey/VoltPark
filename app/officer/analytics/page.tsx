'use client'
import Shell from '../../ui/Shell'

export default function OfficerAnalytics() {
  return (
    <Shell
      title="Analytics Overview"
      toolbar={[
        'Report Violation',
        'Vehicle Hold',
        'Record Offense',
      ]}
      actions={[
        { label: 'Export Report', href: '#' },
      ]}
      nav={[
        { label: 'Dashboard', href: '/officer', icon: 'home' },
        { label: 'Enforcement', href: '/officer/enforcement', icon: 'violation' },
        { label: 'Analytics', href: '/officer/analytics', icon: 'analytics' },
        { label: 'Sales & Revenue', href: '/officer/sales', icon: 'payment' },
      ]}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat Cards */}
          <div className="p-6 rounded-xl border border-[var(--border)] bg-card">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)]">
              Total Occupancy
            </h3>
            <p className="text-3xl font-bold mt-2">87%</p>
            <span className="text-xs text-green-500 font-medium">
              +2.5% from last hour
            </span>
          </div>
          <div className="p-6 rounded-xl border border-[var(--border)] bg-card">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)]">
              Active Violations
            </h3>
            <p className="text-3xl font-bold mt-2">12</p>
            <span className="text-xs text-red-500 font-medium">
              -4 from yesterday
            </span>
          </div>
          <div className="p-6 rounded-xl border border-[var(--border)] bg-card">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)]">
              Tickets Issued
            </h3>
            <p className="text-3xl font-bold mt-2">45</p>
            <span className="text-xs text-green-500 font-medium">
              Daily Goal: 50
            </span>
          </div>
          <div className="p-6 rounded-xl border border-[var(--border)] bg-card">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)]">
              Revenue Today
            </h3>
            <p className="text-3xl font-bold mt-2">$1,240</p>
            <span className="text-xs text-green-500 font-medium">
              +12% vs average
            </span>
          </div>
        </div>
        
        {/* Placeholder for charts/graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="p-6 rounded-xl border border-[var(--border)] bg-card h-64 flex items-center justify-center text-[var(--muted-foreground)]">
                Occupancy Trend Chart Placeholder
             </div>
             <div className="p-6 rounded-xl border border-[var(--border)] bg-card h-64 flex items-center justify-center text-[var(--muted-foreground)]">
                Violation Types Chart Placeholder
             </div>
        </div>
      </div>
    </Shell>
  )
}
