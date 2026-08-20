import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const workoutSession = await prisma.workoutSession.findFirst({
      where: { id, userId: session.user.id },
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
    })

    if (!workoutSession) {
      return NextResponse.json({ error: 'Workout session not found' }, { status: 404 })
    }

    return NextResponse.json(workoutSession)
  } catch (error) {
    console.error('Error fetching workout session:', error)
    return NextResponse.json({ error: 'Failed to fetch workout session' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { endTime, duration, notes, rating, exercises } = body

    const workoutSession = await prisma.workoutSession.update({
      where: { id, userId: session.user.id },
      data: {
        endTime: endTime ? new Date(endTime) : undefined,
        duration,
        notes,
        rating,
        exercises: exercises ? {
          deleteMany: {},
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
        } : undefined,
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
    console.error('Error updating workout session:', error)
    return NextResponse.json({ error: 'Failed to update workout session' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.workoutSession.delete({
      where: { id, userId: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting workout session:', error)
    return NextResponse.json({ error: 'Failed to delete workout session' }, { status: 500 })
  }
}