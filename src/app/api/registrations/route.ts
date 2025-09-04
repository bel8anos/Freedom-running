import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/custom-auth'
import dbConnect from '@/lib/db'
import { RegistrationModel } from '@/models/Registration'
import { RaceModel } from '@/models/Race'
import { z } from 'zod'

const CreateRegistrationSchema = z.object({
  raceId: z.string().min(1),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const requestedUserId = searchParams.get('userId')
    const raceId = searchParams.get('raceId')

    const filter: any = {}
    if (raceId) filter.raceId = raceId

    // Non-admins can only see their own registrations; admins can filter by userId if provided
    if (session.user.role !== 'admin') {
      filter.userId = requestedUserId || session.user.id
      if (requestedUserId && requestedUserId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } else if (requestedUserId) {
      filter.userId = requestedUserId
    }

    if (session.user.role !== 'admin' && filter.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const registrations = await RegistrationModel.find(filter)
      .populate('userId', 'name email image')
      .populate('raceId', 'name location startDate status')
      .sort({ registeredAt: -1 })
      .lean()

    return NextResponse.json(registrations)
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()
    const { raceId } = CreateRegistrationSchema.parse(body)
    
    const race = await RaceModel.findById(raceId)
    if (!race) {
      return NextResponse.json({ error: 'Race not found' }, { status: 404 })
    }

    if (race.status !== 'registration_open') {
      return NextResponse.json({ error: 'Registration is not open for this race' }, { status: 400 })
    }

    if (new Date() > race.registrationDeadline) {
      return NextResponse.json({ error: 'Registration deadline has passed' }, { status: 400 })
    }

    const existingRegistration = await RegistrationModel.findOne({
      userId: session.user.id,
      raceId
    })

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered for this race' }, { status: 400 })
    }

    if (race.maxParticipants) {
      const approvedCount = await RegistrationModel.countDocuments({
        raceId,
        status: 'approved'
      })
      
      if (approvedCount >= race.maxParticipants) {
        return NextResponse.json({ error: 'Race is full' }, { status: 400 })
      }
    }

    const registration = await RegistrationModel.create({
      userId: session.user.id,
      raceId,
      status: 'approved'
    })

    await registration.populate([
      { path: 'userId', select: 'name email image' },
      { path: 'raceId', select: 'name location startDate status' }
    ])
    
    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating registration:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}