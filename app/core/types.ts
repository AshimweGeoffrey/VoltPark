export type Role = 'ADMIN' | 'OFFICER' | 'DRIVER'
export type SessionStatus = 'ACTIVE' | 'COMPLETED' | 'OVERDUE'
export type TicketStatus = 'PENDING' | 'PAID' | 'APPEALED' | 'DISMISSED'
export type VehicleType = 'CAR' | 'MOTORCYCLE' | 'TRUCK'
export type EntryMethod = 'MANUAL' | 'OCR'

export interface Profile {
  id: string
  fullName: string | null
  role: Role
  balance: number
  phoneNumber: string | null
  createdAt: string
  updatedAt: string
}

export interface Vehicle {
  id: string
  plateNumber: string
  ownerId: string
  type: VehicleType
  createdAt: string
  updatedAt: string
}

export interface ParkingZone {
  id: string
  name: string
  ratePerHour: number
  currency: string
  location: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ParkingSession {
  id: string
  vehicleId: string
  zoneId: string
  startTime: string
  endTime: string | null
  totalCost: number | null
  status: SessionStatus
  entryImageUrl: string | null
  entryMethod: EntryMethod
  deviceId: string | null
  createdAt: string
  updatedAt: string
  // Joined fields
  vehicle?: Vehicle
  zone?: ParkingZone
}

export interface Ticket {
  id: string
  offenderId: string | null
  vehicleId: string | null
  officerId: string
  zoneId: string | null
  violationType: string
  fineAmount: number
  evidenceImageUrl: string | null
  status: TicketStatus
  createdAt: string
  updatedAt: string
  // Joined fields
  offender?: Profile
  officer?: Profile
  vehicle?: Vehicle
  zone?: ParkingZone
}

export interface NotificationItem {
  id: string
  userId: string
  title: string
  message: string
  read: boolean
  type: string | null
  createdAt: string
}
