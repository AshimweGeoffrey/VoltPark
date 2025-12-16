import Link from 'next/link'
import { Button } from '../../ui/Button'

export default function OfficerSales() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[var(--foreground)]">
              Sales & Revenue
            </h1>
            <p className="text-[var(--muted-foreground)]">
              Track financial performance and transactions.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">Export Report</Button>
          </div>
        </div>

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
                    <p className="font-bold">$12,450.00</p>
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
                        Transient visitors
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$4,230.50</p>
                    <p className="text-xs text-green-500">+12%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[var(--muted)]/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                      T
                    </div>
                    <div>
                      <p className="font-medium">Ticket Fines</p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Enforcement revenue
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">$1,850.00</p>
                    <p className="text-xs text-red-500">-2%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="p-6 rounded-xl border border-[var(--border)] bg-card h-fit">
            <h3 className="text-lg font-semibold mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-sm border-b border-[var(--border)] pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">License Plate ABC-{100 + i}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      2 mins ago
                    </p>
                  </div>
                  <span className="font-mono font-medium">+$12.00</span>
                </div>
              ))}
            </div>
            <Button className="w-full mt-6" variant="outline">
              View All Transactions
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
