import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const muscleGroups = searchParams.get('muscleGroups')?.split(',').filter(Boolean) || []
    const types = searchParams.get('types')?.split(',').filter(Boolean) || []
    const equipment = searchParams.get('equipment')?.split(',').filter(Boolean) || []
    const difficulty = searchParams.get('difficulty') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { muscleGroups: { hasSome: [search] } },
      ]
    }

    if (muscleGroups.length > 0) {
      where.muscleGroups = { hasSome: muscleGroups }
    }

    if (types.length > 0) {
      where.type = { in: types }
    }

    if (equipment.length > 0) {
      where.equipment = { hasSome: equipment }
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    const [exercises, total] = await Promise.all([
      prisma.exercise.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.exercise.count({ where }),
    ])

    return NextResponse.json({
      exercises,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching exercises:', error)
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 })
  }
}