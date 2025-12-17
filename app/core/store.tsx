'use client'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { supabase } from '../../lib/supabase'
import type {
  ParkingZone,
  Profile,
  Vehicle,
  ParkingSession,
  Ticket,
  NotificationItem,
  Role,
  SessionStatus,
  TicketStatus,
  EntryMethod,
  VehicleType,
} from './types'
import { uid, nowISO } from './utils'
import { useToast } from './toast'

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
  vehicles: Vehicle[]
  sessions: ParkingSession[]
  tickets: Ticket[]
  payments: Payment[]
  notifications: NotificationItem[]
  loading: boolean
}

type Store = State & {
  refresh(): Promise<void>
  addZone(z: Omit<ParkingZone, 'id' | 'createdAt' | 'updatedAt'>): Promise<void>
  updateZone(z: ParkingZone): Promise<void>
  removeZone(id: string): Promise<void>

  upsertUser(
    u: Partial<Profile> & { fullName: string; role: Role }
  ): Promise<void>
  deleteUser(id: string): Promise<void>
  switchRole(role: Role): Promise<void>
  addVehicle(plate: string, type: VehicleType): Promise<boolean>

  startSession(input: {
    vehicleId: string
    zoneId: string
    entryMethod: EntryMethod
    startTime?: string
    endTime?: string | null
    entryImageUrl?: string | null
    deviceId?: string | null
  }): Promise<string | null>
  closeSession(id: string): Promise<void>

  issueTicket(t: {
    sessionId?: string
    vehicleId?: string
    zoneId?: string
    issuedBy: string
    fineAmount: number
    reason: string
    status?: TicketStatus
  }): Promise<string | null>
  payTicket(
    ticketId: string,
    amount: number,
    method: Payment['method']
  ): Promise<string>
  appealTicket(ticketId: string, notes: string): Promise<void>

  notify(n: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): void
  markRead(id: string): void
  seed(): void // Deprecated but kept for compatibility if needed, though it will do nothing or just refresh
}

const defaultState: State = {
  zones: [],
  users: [],
  vehicles: [],
  sessions: [],
  tickets: [],
  payments: [],
  notifications: [],
  loading: false, // Start false, let useEffect trigger loading if needed
}

const Ctx = createContext<Store | null>(null)

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<State>(defaultState)
  const toast = useToast()

  const fetchData = async () => {
    // Only set loading if it's the initial load or explicit refresh
    // setState((s) => ({ ...s, loading: true }))

    try {
      const [zonesRes, usersRes, vehiclesRes, sessionsRes, ticketsRes] =
        await Promise.all([
          supabase.from('parking_zones').select('*'),
          supabase.from('profiles').select('*'),
          supabase.from('vehicles').select('*'),
          supabase.from('parking_sessions').select('*'),
          supabase.from('tickets').select('*'),
        ])

      if (zonesRes.error) console.error('Error fetching zones:', zonesRes.error)
      if (usersRes.error) console.error('Error fetching users:', usersRes.error)
      if (vehiclesRes.error)
        console.error('Error fetching vehicles:', vehiclesRes.error)
      if (sessionsRes.error)
        console.error('Error fetching sessions:', sessionsRes.error)
      if (ticketsRes.error)
        console.error('Error fetching tickets:', ticketsRes.error)

      const mapZone = (z: any): ParkingZone => ({
        id: z.id,
        name: z.name,
        ratePerHour: z.rate_per_hour,
        currency: z.currency,
        location: z.location,
        isActive: z.is_active,
        createdAt: z.created_at,
        updatedAt: z.updated_at,
      })

      const mapProfile = (p: any): Profile => ({
        id: p.id,
        fullName: p.full_name,
        role: p.role,
        balance: p.balance,
        phoneNumber: p.phone_number,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      })

      const mapVehicle = (v: any): Vehicle => ({
        id: v.id,
        plateNumber: v.plate_number,
        ownerId: v.owner_id,
        type: v.type,
        createdAt: v.created_at,
        updatedAt: v.updated_at,
      })

      const mapSession = (s: any): ParkingSession => ({
        id: s.id,
        vehicleId: s.vehicle_id,
        zoneId: s.zone_id,
        startTime: s.start_time,
        endTime: s.end_time,
        totalCost: s.total_cost,
        status: s.status,
        entryImageUrl: s.entry_image_url,
        entryMethod: s.entry_method,
        deviceId: s.device_id,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      })

      const mapTicket = (t: any): Ticket => ({
        id: t.id,
        sessionId: t.session_id,
        vehicleId: t.vehicle_id,
        zoneId: t.zone_id,
        issuedBy: t.issued_by,
        fineAmount: t.fine_amount,
        reason: t.violation_type, // Map violation_type to reason
        status: t.status,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      })

      setState((s) => ({
        ...s,
        zones: (zonesRes.data || []).map(mapZone),
        users: (usersRes.data || []).map(mapProfile),
        vehicles: (vehiclesRes.data || []).map(mapVehicle),
        sessions: (sessionsRes.data || []).map(mapSession),
        tickets: (ticketsRes.data || []).map(mapTicket),
        loading: false,
      }))
    } catch (error) {
      console.error('Error fetching data:', error)
      setState((s) => ({ ...s, loading: false }))
    }
  }

  useEffect(() => {
    setState((s) => ({ ...s, loading: true }))
    fetchData()

    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const api = useMemo<Store>(
    () => ({
      ...state,
      seed() {
        fetchData()
      },
      refresh: fetchData,
      async addZone(z) {
        const { error } = await supabase.from('parking_zones').insert({
          id: uid('zone'),
          name: z.name,
          rate_per_hour: z.ratePerHour,
          currency: z.currency,
          location: z.location,
          is_active: z.isActive,
          updated_at: nowISO(),
        })
        if (error) {
          console.error('Error adding zone:', error)
          toast.error('Failed to add zone')
        } else {
          toast.success('Zone added successfully')
        }
        await fetchData()
      },
      async updateZone(z) {
        const { error } = await supabase
          .from('parking_zones')
          .update({
            name: z.name,
            rate_per_hour: z.ratePerHour,
            currency: z.currency,
            location: z.location,
            is_active: z.isActive,
            updated_at: nowISO(),
          })
          .eq('id', z.id)
        if (error) {
          console.error('Error updating zone:', error)
          toast.error('Failed to update zone')
        } else {
          toast.success('Zone updated successfully')
        }
        await fetchData()
      },
      async removeZone(id) {
        const { error } = await supabase
          .from('parking_zones')
          .delete()
          .eq('id', id)
        if (error) {
          console.error('Error removing zone:', error)
          toast.error('Failed to remove zone')
        } else {
          toast.success('Zone removed successfully')
        }
        await fetchData()
      },
      async upsertUser(u) {
        if (u.id) {
          const { error } = await supabase
            .from('profiles')
            .update({
              full_name: u.fullName,
              role: u.role,
              balance: u.balance,
              phone_number: u.phoneNumber,
              updated_at: nowISO(),
            })
            .eq('id', u.id)
          if (error) {
            console.error('Error updating user:', error)
            toast.error('Failed to update user')
          } else {
            toast.success('User updated successfully')
          }
        }
        await fetchData()
      },
      async deleteUser(id) {
        const { error } = await supabase.from('profiles').delete().eq('id', id)
        if (error) {
          console.error('Error deleting user:', error)
          toast.error('Failed to delete user')
        } else {
          toast.success('User deleted successfully')
        }
        await fetchData()
      },
      async switchRole(role) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
          .from('profiles')
          .update({ role, updated_at: nowISO() })
          .eq('id', user.id)

        if (error) {
          console.error('Error switching role:', error)
          toast.error('Failed to switch role')
        } else {
          toast.success(`Role switched to ${role}`)
          // Redirect to the appropriate dashboard
          const paths: Record<string, string> = {
            ADMIN: '/admin',
            OFFICER: '/officer',
            DRIVER: '/driver',
          }
          window.location.href = paths[role] || '/'
        }
      },
      async addVehicle(plate, type) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          console.error('addVehicle: No authenticated user found')
          toast.error('You must be logged in to add a vehicle')
          return false
        }
        console.log('Adding vehicle:', { plate, type, owner_id: user.id })
        const { error } = await supabase.from('vehicles').insert({
          id: uid('veh'),
          plate_number: plate,
          type,
          owner_id: user.id,
          updated_at: nowISO(),
        })
        if (error) {
          console.error('Error adding vehicle:', error)
          toast.error('Failed to add vehicle: ' + error.message)
          return false
        } else {
          console.log('Vehicle added successfully')
          toast.success('Vehicle added successfully')
          await fetchData()
          return true
        }
      },
      async startSession(input) {
        const { data, error } = await supabase
          .from('parking_sessions')
          .insert({
            id: uid('sess'),
            vehicle_id: input.vehicleId,
            zone_id: input.zoneId,
            start_time: input.startTime || new Date().toISOString(),
            end_time: input.endTime,
            status: 'ACTIVE',
            entry_method: input.entryMethod,
            entry_image_url: input.entryImageUrl,
            device_id: input.deviceId,
            updated_at: nowISO(),
          })
          .select()
          .single()

        if (error) {
          console.error(error)
          toast.error('Failed to start session')
          return null
        }
        toast.success('Session started')
        await fetchData()
        return data.id
      },
      async closeSession(id) {
        const { error } = await supabase
          .from('parking_sessions')
          .update({
            status: 'COMPLETED',
            end_time: new Date().toISOString(),
            updated_at: nowISO(),
          })
          .eq('id', id)

        if (error) {
          console.error(error)
          toast.error('Failed to end session')
        } else {
          toast.success('Session ended')
        }
        await fetchData()
      },
      async issueTicket(t) {
        const { data, error } = await supabase
          .from('tickets')
          .insert({
            id: uid('tick'),
            session_id: t.sessionId,
            vehicle_id: t.vehicleId,
            zone_id: t.zoneId,
            officer_id: t.issuedBy,
            fine_amount: t.fineAmount,
            violation_type: t.reason,
            status: t.status || 'PENDING',
            updated_at: nowISO(),
          })
          .select()
          .single()

        if (error) {
          console.error(error)
          toast.error('Failed to issue ticket')
          return null
        }
        toast.success('Ticket issued')
        await fetchData()
        return data.id
      },
      async payTicket(ticketId, amount, method) {
        const id = uid('pay')
        const payment: Payment = {
          id,
          ticketId,
          amount,
          method,
          processedAt: nowISO(),
        }
        setState((s) => ({ ...s, payments: [payment, ...s.payments] }))

        const { error } = await supabase
          .from('tickets')
          .update({ status: 'PAID', updated_at: nowISO() })
          .eq('id', ticketId)

        if (error) {
          console.error(error)
          toast.error('Failed to process payment')
        } else {
          toast.success('Payment successful')
        }
        await fetchData()
        return id
      },
      async appealTicket(ticketId, notes) {
        const { error } = await supabase
          .from('tickets')
          .update({ status: 'APPEALED', updated_at: nowISO() })
          .eq('id', ticketId)

        if (error) {
          console.error(error)
          toast.error('Failed to submit appeal')
        } else {
          toast.success('Appeal submitted')
        }
        await fetchData()
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
