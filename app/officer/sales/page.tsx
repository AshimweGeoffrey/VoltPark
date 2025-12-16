'use client'
import Shell from '../../ui/Shell'

export default function OfficerSales() {
  return (
    <Shell
      title="Sales & Revenue"
      toolbar={['Report Violation', 'Vehicle Hold', 'Record Offense']}
      actions={[{ label: 'Export Report', href: '#' }]}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl border border-[var(--border)] bg-card">
            <h3 className="text-lg font-semibold mb-6">Revenue Stream</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[var(--muted)]/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    P
                  </div>
                  <div>
                    <p className="font-medium">Parking Permits</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Monthly subscriptions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">RWF 12,450,000</p>
                  <p className="text-xs text-green-500">+5%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--muted)]/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">
                    H
                  </div>
                  <div>
                    <p className="font-medium">Hourly Parking</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Meter payments
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">RWF 4,230,000</p>
                  <p className="text-xs text-green-500">+12%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[var(--muted)]/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                    T
                  </div>
                  <div>
                    <p className="font-medium">Tickets & Fines</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Enforcement revenue
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">RWF 2,150,000</p>
                  <p className="text-xs text-red-500">-2%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-[var(--border)] bg-card h-full">
            <h3 className="text-lg font-semibold mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p className="font-medium">Payment #{1000 + i}</p>
                    <p className="text-[var(--muted-foreground)]">2 mins ago</p>
                  </div>
                  <span className="font-bold text-green-600">+RWF 25,000</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <button className="w-full py-2 text-sm font-medium text-[var(--primary)] hover:underline">
                View All Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
