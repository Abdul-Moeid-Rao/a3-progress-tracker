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
    const plan = await prisma.workoutPlan.findFirst({
      where: { id, userId: session.user.id },
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

    if (!plan) {
      return NextResponse.json({ error: 'Workout plan not found' }, { status: 404 })
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error fetching workout plan:', error)
    return NextResponse.json({ error: 'Failed to fetch workout plan' }, { status: 500 })
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
    const { name, description, isActive, days } = body

    // Delete existing days and exercises
    await prisma.workoutDay.deleteMany({
      where: { workoutPlanId: id },
    })

    const plan = await prisma.workoutPlan.update({
      where: { id, userId: session.user.id },
      data: {
        name,
        description,
        isActive,
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
    console.error('Error updating workout plan:', error)
    return NextResponse.json({ error: 'Failed to update workout plan' }, { status: 500 })
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
    await prisma.workoutPlan.delete({
      where: { id, userId: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting workout plan:', error)
    return NextResponse.json({ error: 'Failed to delete workout plan' }, { status: 500 })
  }
}