'use server'

import { ocr_text } from '../../lib/ocr'
import { prisma } from '../../lib/prisma'
import { EntryMethod } from '@prisma/client'

export async function processImage(formData: FormData) {
  const image = formData.get('image') as string
  if (!image) throw new Error('No image provided')

  try {
    const text = await ocr_text(image)
    return { success: true, text }
  } catch (error: any) {
    console.error('OCR Error:', error)
    return { success: false, error: error.message }
  }
}

export async function getZones() {
  try {
    const zones = await prisma.parkingZone.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        ratePerHour: true,
        currency: true,
      },
    })

    // Convert Decimal to number for client serialization
    return zones.map((z) => ({
      id: z.id,
      name: z.name,
      currency: z.currency,
      rate_per_hour: z.ratePerHour.toNumber(),
    }))
  } catch (error: any) {
    console.error('Failed to fetch zones:', error)
    throw new Error('Failed to fetch zones')
  }
}

export async function createPublicSession(plate: string, zoneId: string) {
  try {
    // 1. Find or Create Vehicle
    let vehicleId: string

    const existingVehicle = await prisma.vehicle.findUnique({
      where: {
        plateNumber: plate,
      },
    })

    if (existingVehicle) {
      vehicleId = existingVehicle.id
    } else {
      // Find an admin to assign the guest vehicle to
      const adminUser = await prisma.profile.findFirst({
        where: {
          role: 'ADMIN',
        },
      })

      if (!adminUser) {
        throw new Error(
          'System configuration error: No admin found to assign guest vehicle.'
        )
      }

      const newVehicle = await prisma.vehicle.create({
        data: {
          plateNumber: plate,
          ownerId: adminUser.id,
          type: 'CAR',
        },
      })
      vehicleId = newVehicle.id
    }

    // 2. Create Session
    const session = await prisma.parkingSession.create({
      data: {
        vehicleId: vehicleId,
        zoneId: zoneId,
        startTime: new Date(),
        status: 'ACTIVE',
        entryMethod: 'OCR',
      },
    })

    return {
      success: true,
      session: { ...session, totalCost: session.totalCost?.toNumber() },
    }
  } catch (error: any) {
    console.error('Session creation error:', error)
    throw new Error(error.message || 'Failed to create session')
  }
}
