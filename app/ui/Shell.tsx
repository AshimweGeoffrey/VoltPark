'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../logo.png'
import { useAuth } from '../core/auth'
import { useStore } from '../core/store'
import { useRouter, usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'
import { Button } from './Button'

type IconKey =
  | 'home'
  | 'config'
  | 'users'
  | 'analytics'
  | 'session'
  | 'tickets'
  | 'bell'
  | 'payment'
  | 'violation'
  | 'hold'
  | 'offense'
  | 'logout'

export interface NavItem {
  label: string
  href: string
  icon?: IconKey
}

function Icon({ name }: { name: IconKey }) {
  const common = 'h-7 w-7'
  switch (name) {
    case 'home':
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 10v9h14v-9" />
        </svg>
      )
    case 'config':
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path
            d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1-2 3.4-1.2-.1a1.7 1.7 0 0 0-1.6.9l-.1.2H9.1l-.1-.2a1.7 1.7 0 0 0-1.6-.9l-1.2.1-2-3.4.1-.1a1.7 1.7 0 0 0 .3-1.8l-.8-1.1L4 9l1.3-.2a1.7 1.7 0 0 0 1.2-1.2L6.8 6h10.4l.3 1.6a1.7 1.7 0 0 0 1.2 1.2L20 9l.9 3-1.5 1.9z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'users':
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      )
    case 'analytics':
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 20h16" />
          <path d="M7 20V10" />
          <path d="M12 20V6" />
          <path d="M17 20V13" />
        </svg>
      )
    case 'session':
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6l4 2" />
        </svg>
      )
    case 'tickets':
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 8h18v8H3z" />
          <path d="M7 8v8" />
          <path d="M17 8v8" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      )
    case 'bell':
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22z" />
          <path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2z" />
        </svg>
      )
    case 'payment':
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18" />
        </svg>
      )
    case 'violation':
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    case 'hold':
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    case 'offense':
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    case 'logout':
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      )
  }
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export default function Shell({
  title,
  actions = [],
  nav = [],
  toolbar = [],
  notifications,
  onMarkRead,
  children,
}: PropsWithChildren<{
  title: string
  actions?: { label: string; href?: string; onClick?: () => void }[]
  nav?: NavItem[]
  toolbar?: string[]
  notifications?: NotificationItem[]
  onMarkRead?: (id: string) => void
}>) {
  const { signOut, profile } = useAuth()
  const store = useStore()
  const router = useRouter()
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)

  const isActive = (href: string) => {
    // If href is exactly the current path, it's active
    if (pathname === href) return true
    // If href is not root (e.g. /admin) and pathname starts with it (e.g. /admin/users), it's active
    // BUT we need to be careful. If href is /admin, we don't want it active for /admin/users if /admin/users is also in the list.
    // Actually, usually "Home" is just /admin.
    // Let's try: exact match OR (startsWith AND href is not the parent of another active link... too complex)
    // Simple rule:
    // 1. Exact match always wins.
    // 2. If no exact match, find the longest matching prefix?
    // For this app:
    // /admin -> Home
    // /admin/config -> Config
    // If I am at /admin/config, /admin should NOT be active.
    // So for "Home" links (ending in nothing or just base), require exact match.

    // Heuristic: if the href is the "root" of the section (e.g. /admin or /driver), require exact match.
    if (href === '/admin' || href === '/driver' || href === '/officer') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[var(--muted)]/30">
      <aside className="w-full md:w-80 md:h-screen md:sticky md:top-0 z-20 flex flex-col bg-[var(--background)] border-r border-[var(--border)]/50 shadow-xl shadow-zinc-200/20">
        <div className="flex items-center gap-4 px-8 py-8 md:py-10">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src={logo}
              alt="VoltPark"
              width={180}
              height={48}
              className="h-12 w-auto"
            />
          </Link>
        </div>
        <nav className="flex-1 space-y-2 px-6 py-4 overflow-y-auto">
          {nav.map((n) => {
            const active = isActive(n.href)
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-medium transition-all duration-300 ${
                  active
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg shadow-[var(--primary)]/25 scale-[1.02]'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
                }`}
              >
                {n.icon && <Icon name={n.icon} />}
                <span>{n.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-6 mt-auto">
          <button
            onClick={async () => {
              await signOut()
              router.push('/login')
            }}
            className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-medium text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-all duration-300 mb-4"
          >
            <Icon name="logout" />
            <span>Logout</span>
          </button>
          <div className="rounded-2xl bg-[var(--secondary)] p-5 border border-[var(--border)]">
            {profile && (
              <div className="mb-2">
                <div className="font-bold text-[var(--foreground)] truncate">
                  {profile.fullName || 'User'}
                </div>
                <div className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-medium">
                  {profile.role}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <div className="text-sm font-bold text-[var(--foreground)]">
                System Online
              </div>
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              VoltPark v2.1.0
            </div>
            {/* Dev Role Switcher */}
            <div className="mt-2 flex gap-1">
              {(['ADMIN', 'OFFICER', 'DRIVER'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => store.switchRole(r)}
                  className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    profile?.role === r
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                      : 'bg-transparent text-[var(--muted-foreground)] border-[var(--border)]'
                  }`}
                >
                  {r[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 md:px-8 md:py-8 w-full">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between mb-12">
            <h1 className="text-5xl font-bold tracking-tight text-[var(--foreground)]">
              {title}
            </h1>
            <div className="flex flex-1 items-center gap-4 md:justify-end">
              <div className="relative w-full md:w-96 group">
                <svg
                  className="absolute left-5 top-4 h-5 w-5 text-[var(--muted-foreground)] group-focus-within:text-[var(--primary)] transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="h-14 w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] pl-14 pr-6 text-lg shadow-sm transition-all focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                />
              </div>

              {notifications && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-14 w-14 text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <div className="relative">
                      <Icon name="bell" />
                      {notifications.some((n) => !n.read) && (
                        <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-[var(--background)]"></span>
                      )}
                    </div>
                  </Button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-4 w-80 sm:w-96 rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-4 border-b border-[var(--border)] bg-[var(--muted)]/30 flex items-center justify-between">
                        <h3 className="font-bold text-[var(--foreground)]">
                          Notifications
                        </h3>
                        <span className="text-xs font-medium text-[var(--muted-foreground)]">
                          {notifications.filter((n) => !n.read).length} unread
                        </span>
                      </div>
                      <div className="max-h-[400px] overflow-y-auto p-2 space-y-2">
                        {notifications.length === 0 && (
                          <div className="py-8 text-center text-sm text-[var(--muted-foreground)]">
                            No notifications
                          </div>
                        )}
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-4 rounded-xl transition-colors ${
                              n.read
                                ? 'bg-transparent opacity-75'
                                : 'bg-[var(--primary)]/5'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-3">
                              <div>
                                <div className="text-sm font-bold text-[var(--foreground)]">
                                  {n.title}
                                </div>
                                <div className="text-xs text-[var(--muted-foreground)] mt-1">
                                  {n.message}
                                </div>
                                <div className="text-[10px] text-[var(--muted-foreground)]/70 mt-2 uppercase tracking-wider font-medium">
                                  {new Date(n.createdAt).toLocaleTimeString(
                                    [],
                                    {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                </div>
                              </div>
                              {!n.read && onMarkRead && (
                                <button
                                  onClick={() => onMarkRead(n.id)}
                                  className="h-2 w-2 rounded-full bg-[var(--primary)] shrink-0 mt-1.5 hover:scale-150 transition-transform"
                                  title="Mark as read"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {actions.map((a) =>
                a.href ? (
                  <Link key={a.label} href={a.href}>
                    <Button
                      size="lg"
                      className="rounded-xl h-14 px-8 text-lg shadow-lg shadow-[var(--primary)]/20"
                    >
                      {a.label}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={a.label}
                    size="lg"
                    className="rounded-xl h-14 px-8 text-lg shadow-lg shadow-[var(--primary)]/20"
                    onClick={a.onClick}
                  >
                    {a.label}
                  </Button>
                )
              )}
            </div>
          </div>
          {toolbar.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-3">
              {toolbar.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full bg-[var(--background)] border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-sm transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-md cursor-pointer"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
