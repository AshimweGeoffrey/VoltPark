import { supabase } from './supabase'
import { uid } from '../app/core/utils'

// Rwandan Data Constants
const RWANDA_ZONES = [
  { name: 'Kigali Heights', rate: 500, location: 'Kimihurura, Kigali' },
  { name: 'CHIC Building', rate: 400, location: 'Downtown, Kigali' },
  { name: 'Kigali City Tower', rate: 600, location: 'Downtown, Kigali' },
  { name: 'Remera Corner', rate: 300, location: 'Remera, Kigali' },
  { name: 'Nyamirambo Stadium', rate: 200, location: 'Nyamirambo, Kigali' },
  {
    name: 'Kigali Convention Centre',
    rate: 800,
    location: 'Kimihurura, Kigali',
  },
  { name: 'M. Peace Plaza', rate: 500, location: 'Downtown, Kigali' },
  { name: 'Gishushu Hub', rate: 400, location: 'Gishushu, Kigali' },
  { name: 'Kicukiro Market', rate: 200, location: 'Kicukiro, Kigali' },
  { name: 'Airport Parking', rate: 1000, location: 'Kanombe, Kigali' },
]

const RWANDA_PLATES = [
  'RAA 123 A',
  'RAB 456 B',
  'RAC 789 C',
  'RAD 101 D',
  'RAE 202 E',
  'RAF 303 F',
  'RAG 404 G',
  'RAH 505 H',
  'RAI 606 I',
  'RAJ 707 J',
]

const VIOLATIONS = [
  'Expired Parking',
  'Illegal Parking',
  'Blocking Driveway',
  'Double Parking',
  'Handicap Zone Violation',
]

export const seedDatabase = async (currentUserId: string) => {
  console.log('Starting seed...')
  const now = new Date().toISOString()

  // 1. Create Zones
  const zones = []
  for (const z of RWANDA_ZONES) {
    // Check if exists
    const { data: existing } = await supabase
      .from('parking_zones')
      .select('*')
      .eq('name', z.name)
      .single()

    if (existing) {
      zones.push(existing)
      continue
    }

    const { data, error } = await supabase
      .from('parking_zones')
      .insert({
        id: uid('zone'), // Note: uid() now returns valid UUIDs
        name: z.name,
        rate_per_hour: z.rate,
        currency: 'RWF',
        location: z.location,
        is_active: true,
        updated_at: now,
      })
      .select()
      .single()

    if (data) zones.push(data)
    if (error) console.error('Error seeding zone:', error)
  }

  // 2. Create Vehicles (Owned by current user for simplicity, or we'd need to create dummy users)
  // Since we can't easily create other users without auth, we'll assign all vehicles to the current admin
  // This allows the admin to see them in "My Vehicles" but also allows testing sessions.
  const vehicles = []
  for (const plate of RWANDA_PLATES) {
    // Check if exists first
    const { data: existing } = await supabase
      .from('vehicles')
      .select('id')
      .eq('plate_number', plate)
      .single()

    if (existing) {
      vehicles.push(existing)
      continue
    }

    const { data, error } = await supabase
      .from('vehicles')
      .insert({
        id: uid('veh'),
        plate_number: plate,
        owner_id: currentUserId,
        type: 'CAR',
        updated_at: now,
      })
      .select()
      .single()

    if (data) vehicles.push(data)
    if (error) console.error('Error seeding vehicle:', error)
  }

  if (zones.length === 0 || vehicles.length === 0) {
    console.error('Not enough zones or vehicles to seed sessions')
    return
  }

  // 3. Create Sessions
  const sessions = []
  for (let i = 0; i < 35; i++) {
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)]
    const zone = zones[Math.floor(Math.random() * zones.length)]
    const isCompleted = Math.random() > 0.3
    // Random time within last 7 days
    const startTime = new Date(
      Date.now() - Math.random() * 86400000 * 7
    ).toISOString()

    const { data, error } = await supabase
      .from('parking_sessions')
      .insert({
        id: uid('sess'),
        vehicle_id: vehicle.id,
        zone_id: zone.id,
        start_time: startTime,
        end_time: isCompleted
          ? new Date(
              new Date(startTime).getTime() + Math.random() * 7200000
            ).toISOString() // 0-2 hours later
          : null,
        status: isCompleted ? 'COMPLETED' : 'ACTIVE',
        entry_method: 'MANUAL',
        updated_at: now,
      })
      .select()
      .single()

    if (data) sessions.push(data)
    if (error) console.error('Error seeding session:', error)
  }

  // 4. Create Tickets
  for (let i = 0; i < 30; i++) {
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)]
    const zone = zones[Math.floor(Math.random() * zones.length)]
    const status = ['PENDING', 'PAID', 'APPEALED', 'DISMISSED'][
      Math.floor(Math.random() * 4)
    ]

    const { error } = await supabase.from('tickets').insert({
      id: uid('tick'),
      vehicle_id: vehicle.id,
      zone_id: zone.id,
      officer_id: currentUserId, // Assigned to current user as officer
      violation_type: VIOLATIONS[Math.floor(Math.random() * VIOLATIONS.length)],
      fine_amount: (Math.floor(Math.random() * 5) + 1) * 5000, // 5000 - 25000 RWF
      status: status,
      created_at: new Date(
        Date.now() - Math.random() * 86400000 * 5
      ).toISOString(), // Last 5 days
      updated_at: now,
    })

    if (error) console.error('Error seeding ticket:', error)
  }

  console.log('Seeding complete!')
}
