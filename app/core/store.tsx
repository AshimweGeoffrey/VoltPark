'use client'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type {
  ParkingZone,
  Profile,
  ParkingSession,
  Ticket,
  NotificationItem,
  Role,
  SessionStatus,
  TicketStatus,
  EntryMethod,
} from './types'
import { uid, nowISO } from './utils'

// Temporary Payment type until added to DB schema
export interface Payment {
  id: string
  ticketId: string
  amount: number
  method: 'CARD' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'BANK'
  processedAt: string
}

type State = {
  zones: ParkingZone[]
  users: Profile[]
  sessions: ParkingSession[]
  tickets: Ticket[]
  payments: Payment[]
  notifications: NotificationItem[]
}

type Store = State & {
  seed(): void
  addZone(z: Omit<ParkingZone, 'id' | 'createdAt' | 'updatedAt'>): void
  updateZone(z: ParkingZone): void
  removeZone(id: string): void

  upsertUser(
    u: Partial<Profile> & { fullName: string; role: Role }
  ): void
  deleteUser(id: string): void

  startSession(input: Omit<ParkingSession, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'startTime' | 'endTime' | 'totalCost'> & { startTime?: string }): string
  closeSession(id: string): void

  issueTicket(
    t: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt'> & {
      status?: TicketStatus
    }
  ): string
  payTicket(ticketId: string, amount: number, method: Payment['method']): string
  appealTicket(ticketId: string, notes: string): void // Notes not in DB schema yet, maybe add to Ticket?

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

const STORAGE_KEY = 'voltpark_store_v2'

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
        const zones: ParkingZone[] = [
          {
            id: uid('zone'),
            name: 'Kigali Heights',
            ratePerHour: 500,
            currency: 'RWF',
            location: 'Kigali',
            isActive: true,
            createdAt: nowISO(),
            updatedAt: nowISO(),
          },
          {
            id: uid('zone'),
            name: 'CHIC',
            ratePerHour: 300,
            currency: 'RWF',
            location: 'Kigali',
            isActive: true,
            createdAt: nowISO(),
            updatedAt: nowISO(),
          },
        ]
        const users: Profile[] = [
          {
            id: uid('u'),
            fullName: 'Alice Admin',
            role: 'ADMIN',
            balance: 0,
            phoneNumber: null,
            createdAt: nowISO(),
            updatedAt: nowISO(),
          },
          {
            id: uid('u'),
            fullName: 'Oscar Officer',
            role: 'OFFICER',
            balance: 0,
            phoneNumber: null,
            createdAt: nowISO(),
            updatedAt: nowISO(),
          },
          {
            id: uid('u'),
            fullName: 'Diane Driver',
            role: 'DRIVER',
            balance: 5000,
            phoneNumber: '0780000000',
            createdAt: nowISO(),
            updatedAt: nowISO(),
          },
        ]
        setState((s) => ({ ...s, zones, users }))
      },
      addZone(z) {
        setState((s) => ({
          ...s,
          zones: [...s.zones, { ...z, id: uid('zone'), createdAt: nowISO(), updatedAt: nowISO() }],
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
            const updated: Profile = { ...existing, ...u, updatedAt: nowISO() } as Profile
            return {
              ...s,
              users: s.users.map((x) => (x.id === updated.id ? updated : x)),
            }
          }
          const created: Profile = {
            id: uid('u'),
            fullName: u.fullName,
            role: u.role,
            balance: 0,
            phoneNumber: null,
            createdAt: nowISO(),
            updatedAt: nowISO(),
            ...u,
          } as Profile
          return { ...s, users: [...s.users, created] }
        })
      },
      deleteUser(id) {
        setState((s) => ({ ...s, users: s.users.filter((u) => u.id !== id) }))
      },
      startSession(input) {
        const id = uid('sess')
        const session: ParkingSession = {
          id,
          status: 'ACTIVE',
          startTime: input.startTime || nowISO(),
          endTime: null,
          totalCost: null,
          createdAt: nowISO(),
          updatedAt: nowISO(),
          ...input,
        }
        setState((s) => ({ ...s, sessions: [session, ...s.sessions] }))
        return id
      },
      closeSession(id) {
        setState((s) => ({
          ...s,
          sessions: s.sessions.map((x) =>
            x.id === id ? { ...x, status: 'COMPLETED', endTime: nowISO() } : x
          ),
        }))
      },
      issueTicket(t) {
        const id = uid('tkt')
        const ticket: Ticket = {
          id,
          status: t.status ?? 'PENDING',
          createdAt: nowISO(),
          updatedAt: nowISO(),
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
            t.id === ticketId ? { ...t, status: 'APPEALED' } : t
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
