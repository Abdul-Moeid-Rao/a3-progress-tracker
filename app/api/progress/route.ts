import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const exerciseId = searchParams.get('exerciseId')
    const timeRange = searchParams.get('timeRange') || '3m'

    const days = { '1m': 30, '3m': 90, '6m': 180, '1y': 365 }[timeRange] || 90
    const cutoff = new Date(Date.now() - days * 86400000)

    // Get sessions with exercises
    const sessions = await prisma.workoutSession.findMany({
      where: {
        userId: session.user.id,
        startTime: { gte: cutoff },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          },
        },
      },
      orderBy: { startTime: 'asc' },
    })

    // Calculate progress data for each exercise
    const exerciseProgress: Record<string, any[]> = {}

    sessions.forEach((session) => {
      session.exercises.forEach((ex) => {
        if (!exerciseProgress[ex.exerciseId]) {
          exerciseProgress[ex.exerciseId] = []
        }

        const completedSets = ex.sets.filter((s) => s.isCompleted)
        if (completedSets.length === 0) return

        const maxWeight = Math.max(...completedSets.map((s) => s.weight))
        const totalVolume = completedSets.reduce((acc, s) => acc + s.weight * s.reps, 0)
        const bestSet = completedSets.reduce((best, current) =>
          current.weight > best.weight ? current : best
        )

        exerciseProgress[ex.exerciseId].push({
          date: session.startTime,
          weight: maxWeight,
          volume: totalVolume,
          reps: bestSet.reps,
          sets: completedSets.length,
          sessionName: session.name,
          duration: session.duration,
        })
      })
    })

    // Filter by exerciseId if provided
    if (exerciseId) {
      return NextResponse.json(exerciseProgress[exerciseId] || [])
    }

    return NextResponse.json(exerciseProgress)
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}