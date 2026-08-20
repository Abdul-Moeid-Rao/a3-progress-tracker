import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessions = await prisma.workoutSession.findMany({
      where: { userId: session.user.id },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
        workoutPlan: true,
        workoutDay: true,
      },
      orderBy: { startTime: 'desc' },
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching workout sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch workout sessions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { workoutPlanId, workoutDayId, name, exercises, notes, duration, rating } = body

    const workoutSession = await prisma.workoutSession.create({
      data: {
        userId: session.user.id,
        workoutPlanId,
        workoutDayId,
        name,
        notes,
        duration,
        rating,
        startTime: new Date(),
        endTime: new Date(),
        exercises: {
          create: exercises.map((ex: any) => ({
            exerciseId: ex.exerciseId,
            notes: ex.notes,
            sets: {
              create: ex.sets.map((set: any) => ({
                setNumber: set.setNumber,
                reps: set.reps,
                weight: set.weight,
                rpe: set.rpe,
                isCompleted: set.isCompleted,
                restSeconds: set.restSeconds,
              })),
            },
          })),
        },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
    })

    return NextResponse.json(workoutSession)
  } catch (error) {
    console.error('Error creating workout session:', error)
    return NextResponse.json({ error: 'Failed to create workout session' }, { status: 500 })
  }
}