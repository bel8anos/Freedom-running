import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/custom-auth'
import dbConnect from '@/lib/db'
import { RaceModel } from '@/models/Race'
import { z } from 'zod'

const CreateRaceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  location: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  registrationDeadline: z.string().datetime(),
  maxParticipants: z.number().min(1).optional(),
  status: z.enum(['upcoming', 'registration_open', 'registration_closed', 'ongoing', 'completed']).optional(),
})

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const location = searchParams.get('location')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const filter: Record<string, any> = {}
    if (status) filter.status = status
    if (location) filter.location = new RegExp(location, 'i')
    if (startDate || endDate) {
      filter.startDate = {}
      if (startDate) filter.startDate.$gte = new Date(startDate)
      if (endDate) filter.startDate.$lte = new Date(endDate)
    }

    const races = await RaceModel.find(filter)
      .populate('createdBy', 'name email')
      .sort({ startDate: 1 })
      .lean()

    return NextResponse.json(races)
  } catch (error) {
    console.error('Error fetching races:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()
    const validatedData = CreateRaceSchema.parse(body)
    
    const raceData = {
      ...validatedData,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate),
      registrationDeadline: new Date(validatedData.registrationDeadline),
      createdBy: session.user.id,
    }

    const race = await RaceModel.create(raceData)
    await race.populate('createdBy', 'name email')
    
    return NextResponse.json(race, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating race:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}