import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const measurements = await prisma.bodyMeasurement.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json(measurements)
  } catch (error) {
    console.error('Error fetching body measurements:', error)
    return NextResponse.json({ error: 'Failed to fetch body measurements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const measurement = await prisma.bodyMeasurement.create({
      data: {
        userId: session.user.id,
        date: new Date(body.date),
        weight: body.weight,
        bodyFatPercentage: body.bodyFatPercentage,
        chest: body.chest,
        waist: body.waist,
        hips: body.hips,
        armLeft: body.armLeft,
        armRight: body.armRight,
        thighLeft: body.thighLeft,
        thighRight: body.thighRight,
        calfLeft: body.calfLeft,
        calfRight: body.calfRight,
        shoulders: body.shoulders,
        neck: body.neck,
        notes: body.notes,
      },
    })

    return NextResponse.json(measurement)
  } catch (error) {
    console.error('Error creating body measurement:', error)
    return NextResponse.json({ error: 'Failed to create body measurement' }, { status: 500 })
  }
}