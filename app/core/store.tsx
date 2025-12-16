'use client'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type {
  ParkingZoneRule,
  User,
  Session,
  Ticket,
  Payment,
  NotificationItem,
} from './types'
import { uid, nowISO } from './utils'

type State = {
  zones: ParkingZoneRule[]
  users: User[]
  sessions: Session[]
  tickets: Ticket[]
  payments: Payment[]
  notifications: NotificationItem[]
}

type Store = State & {
  seed(): void
  addZone(z: Omit<ParkingZoneRule, 'id'>): void
  updateZone(z: ParkingZoneRule): void
  removeZone(id: string): void

  upsertUser(
    u: Partial<User> & { name: string; email: string; role: User['role'] }
  ): void
  deleteUser(id: string): void

  startSession(input: Omit<Session, 'id' | 'status'>): string
  closeSession(id: string): void

  issueTicket(
    t: Omit<Ticket, 'id' | 'status' | 'issuedAt'> & {
      amount: number
      status?: Ticket['status']
    }
  ): string
  payTicket(ticketId: string, amount: number, method: Payment['method']): string
  appealTicket(ticketId: string, notes: string): void

  notify(n: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): void
  markRead(id: string): void
}

const defaultState: State = {
  zones: [],
  users: [],
  sessions: [],
  tickets: [],
  payments: [],
  notifications: [],
}

const Ctx = createContext<Store | null>(null)

const STORAGE_KEY = 'voltpark_store_v1'

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<State>(defaultState)

  // load from localStorage
  useEffect(() => {
    const raw =
      typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (raw) {
      try {
        setState(JSON.parse(raw) as State)
      } catch {}
    }
  }, [])

  // persist
  useEffect(() => {
    if (typeof window !== 'undefined')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const api = useMemo<Store>(
    () => ({
      ...state,
      seed() {
        if (state.zones.length) return // idempotent
        const zones: ParkingZoneRule[] = [
          {
            id: uid('zone'),
            name: 'Downtown A',
            ratePerHour: 3.5,
            maxHours: 3,
            fineAmount: 45,
          },
          {
            id: uid('zone'),
            name: 'Waterfront B',
            ratePerHour: 4.0,
            maxHours: 2,
            fineAmount: 60,
          },
        ]
        const users: User[] = [
          {
            id: uid('u'),
            name: 'Alice Admin',
            email: 'alice@voltpark.io',
            role: 'ADMIN',
          },
          {
            id: uid('u'),
            name: 'Oscar Officer',
            email: 'oscar@voltpark.io',
            role: 'OFFICER',
          },
          {
            id: uid('u'),
            name: 'Diane Driver',
            email: 'diane@voltpark.io',
            role: 'DRIVER',
          },
        ]
        setState((s) => ({ ...s, zones, users }))
      },
      addZone(z) {
        setState((s) => ({
          ...s,
          zones: [...s.zones, { ...z, id: uid('zone') }],
        }))
      },
      updateZone(z) {
        setState((s) => ({
          ...s,
          zones: s.zones.map((x) => (x.id === z.id ? z : x)),
        }))
      },
      removeZone(id) {
        setState((s) => ({ ...s, zones: s.zones.filter((z) => z.id !== id) }))
      },
      upsertUser(u) {
        setState((s) => {
          const existing = s.users.find((x) => x.id === u.id)
          if (existing) {
            const updated: User = { ...existing, ...u } as User
            return {
              ...s,
              users: s.users.map((x) => (x.id === updated.id ? updated : x)),
            }
          }
          const created: User = {
            id: uid('u'),
            name: u.name,
            email: u.email,
            role: u.role,
          } as User
          return { ...s, users: [...s.users, created] }
        })
      },
      deleteUser(id) {
        setState((s) => ({ ...s, users: s.users.filter((u) => u.id !== id) }))
      },
      startSession(input) {
        const id = uid('sess')
        const session: Session = { id, status: 'ACTIVE', ...input }
        setState((s) => ({ ...s, sessions: [session, ...s.sessions] }))
        return id
      },
      closeSession(id) {
        setState((s) => ({
          ...s,
          sessions: s.sessions.map((x) =>
            x.id === id ? { ...x, status: 'CLOSED' } : x
          ),
        }))
      },
      issueTicket(t) {
        const id = uid('tkt')
        const ticket: Ticket = {
          id,
          issuedAt: nowISO(),
          status: t.status ?? 'ISSUED',
          ...t,
        } as Ticket
        setState((s) => ({ ...s, tickets: [ticket, ...s.tickets] }))
        return id
      },
      payTicket(ticketId, amount, method) {
        const id = uid('pay')
        const payment: Payment = {
          id,
          ticketId,
          amount,
          method,
          processedAt: nowISO(),
        }
        setState((s) => ({
          ...s,
          payments: [payment, ...s.payments],
          tickets: s.tickets.map((t) =>
            t.id === ticketId ? { ...t, status: 'PAID' } : t
          ),
        }))
        return id
      },
      appealTicket(ticketId, notes) {
        setState((s) => ({
          ...s,
          tickets: s.tickets.map((t) =>
            t.id === ticketId ? { ...t, status: 'APPEALED', notes } : t
          ),
        }))
      },
      notify(n) {
        const item: NotificationItem = {
          id: uid('ntf'),
          createdAt: nowISO(),
          read: false,
          ...n,
        }
        setState((s) => ({ ...s, notifications: [item, ...s.notifications] }))
      },
      markRead(id) {
        setState((s) => ({
          ...s,
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }))
      },
    }),
    [state]
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useStore = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('StoreProvider missing')
  return ctx
}
