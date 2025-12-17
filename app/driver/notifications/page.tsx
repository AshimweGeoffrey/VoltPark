'use client'
import Shell from '../../ui/Shell'
import { useStore } from '../../core/store'
import { useAuth } from '../../core/auth'
import { Button } from '../../ui/Button'

export default function NotificationsPage() {
  const store = useStore()
  const { user } = useAuth()
  
  const mine = store.notifications.filter((n) => n.userId === user?.id)

  return (
    <Shell
      title="Notifications"
      notificationHref="/driver/notifications"
      nav={[
        { label: 'Home', href: '/driver', icon: 'home' },
        { label: 'Session', href: '/driver/session', icon: 'session' },
        { label: 'Tickets', href: '/driver/tickets', icon: 'tickets' },
      ]}
    >
      <div className="grid gap-4 sm:max-w-md">
        {mine.map((n) => (
          <div
            key={n.id}
            className={`flex items-start justify-between gap-4 rounded-xl p-6 shadow-sm transition-all ${
              n.read
                ? 'bg-[var(--background)] opacity-75'
                : 'bg-[var(--background)] ring-1 ring-[var(--primary)]/20'
            }`}
          >
            <div>
              <div className="text-base font-bold text-[var(--foreground)]">
                {n.title}
              </div>
              <div className="mt-1 text-sm text-[var(--muted-foreground)]">
                {n.message}
              </div>
              <div className="mt-2 text-xs font-medium text-[var(--muted-foreground)]/70">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
            {!n.read ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => store.markRead(n.id)}
              >
                Mark read
              </Button>
            ) : (
              <span className="inline-flex items-center rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted-foreground)]">
                Read
              </span>
            )}
          </div>
        ))}
        {!mine.length && (
          <div className="py-12 text-center text-[var(--muted-foreground)]">
            No notifications
          </div>
        )}
      </div>
    </Shell>
  )
}
