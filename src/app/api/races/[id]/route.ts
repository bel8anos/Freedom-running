import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/custom-auth'
import dbConnect from '@/lib/db'
import { RaceModel } from '@/models/Race'
import { RegistrationModel } from '@/models/Registration'
import { z } from 'zod'

const UpdateRaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(10).max(1000).optional(),
  location: z.string().min(1).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  registrationDeadline: z.string().datetime().optional(),
  maxParticipants: z.number().min(1).optional(),
  status: z.enum(['upcoming', 'registration_open', 'registration_closed', 'ongoing', 'completed']).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const session = await getSession()
    
    const race = await RaceModel.findById(params.id)
      .populate('createdBy', 'name email')
      .lean()

    if (!race) {
      return NextResponse.json({ error: 'Race not found' }, { status: 404 })
    }

    const registrationCount = await RegistrationModel.countDocuments({
      raceId: params.id,
      status: 'approved'
    })

    // If a user is signed in, include their registration for this race
    let userRegistration = null as any
    if (session?.user) {
      userRegistration = await RegistrationModel.findOne({
        raceId: params.id,
        userId: session.user.id,
      }).lean()
    }

    const raceWithCount = {
      ...race,
      registrationCount,
      userRegistration
    }

    return NextResponse.json(raceWithCount)
  } catch (error) {
    console.error('Error fetching race:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()
    const validatedData = UpdateRaceSchema.parse(body)
    
    const updateData: any = { ...validatedData }
    if (validatedData.startDate) updateData.startDate = new Date(validatedData.startDate)
    if (validatedData.endDate) updateData.endDate = new Date(validatedData.endDate)
    if (validatedData.registrationDeadline) updateData.registrationDeadline = new Date(validatedData.registrationDeadline)

    const race = await RaceModel.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')

    if (!race) {
      return NextResponse.json({ error: 'Race not found' }, { status: 404 })
    }
    
    return NextResponse.json(race)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating race:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const race = await RaceModel.findByIdAndDelete(params.id)

    if (!race) {
      return NextResponse.json({ error: 'Race not found' }, { status: 404 })
    }

    await RegistrationModel.deleteMany({ raceId: params.id })
    
    return NextResponse.json({ message: 'Race deleted successfully' })
  } catch (error) {
    console.error('Error deleting race:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}