import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const plans = await prisma.workoutPlan.findMany({
      where: { userId: session.user.id },
      include: {
        days: {
          include: {
            exercises: {
              include: { exercise: true },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { dayOfWeek: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(plans)
  } catch (error) {
    console.error('Error fetching workout plans:', error)
    return NextResponse.json({ error: 'Failed to fetch workout plans' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, days } = body

    const plan = await prisma.workoutPlan.create({
      data: {
        userId: session.user.id,
        name,
        description,
        days: {
          create: days.map((day: any, dayIndex: number) => ({
            dayOfWeek: day.dayOfWeek ?? dayIndex,
            name: day.name,
            exercises: {
              create: day.exercises.map((ex: any, exIndex: number) => ({
                exerciseId: ex.exerciseId,
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight,
                restSeconds: ex.restSeconds || 60,
                order: ex.order ?? exIndex,
                notes: ex.notes,
              })),
            },
          })),
        },
      },
      include: {
        days: {
          include: {
            exercises: {
              include: { exercise: true },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    })

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error creating workout plan:', error)
    return NextResponse.json({ error: 'Failed to create workout plan' }, { status: 500 })
  }
}