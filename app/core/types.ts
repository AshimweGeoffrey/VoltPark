export type Role = 'ADMIN' | 'OFFICER' | 'DRIVER'

export interface ParkingZoneRule {
  id: string
  name: string
  ratePerHour: number // dollars
  maxHours: number
  fineAmount: number // default fine for violations
}

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export interface Session {
  id: string
  driverId: string
  zoneId: string
  vehiclePlate: string
  entryTime: string // ISO
  paidMinutes: number // purchased minutes
  status: 'ACTIVE' | 'EXPIRED' | 'CLOSED'
}

export interface Ticket {
  id: string
  sessionId?: string
  driverId: string
  zoneId: string
  issuedAt: string // ISO
  amount: number
  status: 'NEW' | 'ISSUED' | 'PAID' | 'APPEALED'
  notes?: string
}

export interface Payment {
  id: string
  ticketId: string
  amount: number
  method: 'CARD' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'BANK'
  processedAt: string // ISO
}

export interface NotificationItem {
  id: string
  driverId: string
  createdAt: string // ISO
  title: string
  body: string
  read: boolean
}

export interface AnalyticsSnapshot {
  totalRevenue: number
  totalTickets: number
  violationsByZone: Record<string, number>
  occupancyByZone: Record<string, number> // percentage 0-100
}
