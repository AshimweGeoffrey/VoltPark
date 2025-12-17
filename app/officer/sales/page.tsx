'use client'
import { useStore } from '../../core/store'
import Shell from '../../ui/Shell'

export default function OfficerSales() {
  const store = useStore()
  
  const totalRevenue = store.payments.reduce((acc, p) => acc + p.amount, 0)
  
  return (
    <Shell
      title="Sales & Revenue"
      toolbar={['Report Violation', 'Vehicle Hold', 'Record Offense']}
      actions={[{ label: 'Export Report', href: '#' }]}
      nav={[
        { label: 'Dashboard', href: '/officer', icon: 'home' },
        { label: 'Enforcement', href: '/officer/enforcement', icon: 'violation' },
        { label: 'Analytics', href: '/officer/analytics', icon: 'analytics' },
        { label: 'Sales & Revenue', href: '/officer/sales', icon: 'payment' },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl border border-[var(--border)] bg-card">
            <h3 className="text-lg font-semibold mb-6">Revenue Stream</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[var(--muted)]/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    T
                  </div>
                  <div>
                    <p className="font-medium">Total Revenue</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      All payments
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">RWF {totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-[var(--border)] bg-card h-full">
            <h3 className="text-lg font-semibold mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              {store.payments.slice(0, 10).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-medium">Payment</p>
                    <p className="text-[var(--muted-foreground)]">{new Date(p.processedAt).toLocaleString()}</p>
                  </div>
                  <span className="font-bold text-green-600">+RWF {p.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
