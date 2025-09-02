import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/custom-auth'
import dbConnect from '@/lib/db'
import { RegistrationModel } from '@/models/Registration'
import { z } from 'zod'

const UpdateRegistrationSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  finishTime: z.number().optional(),
  position: z.number().optional(),
})

export async function PATCH(
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
    const validatedData = UpdateRegistrationSchema.parse(body)
    
    const registration = await RegistrationModel.findByIdAndUpdate(
      params.id,
      validatedData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'userId', select: 'name email' },
      { path: 'raceId', select: 'name location startDate' }
    ])

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }
    
    return NextResponse.json(registration)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error updating registration:', error)
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

    const registration = await RegistrationModel.findByIdAndDelete(params.id)

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Registration deleted successfully' })
  } catch (error) {
    console.error('Error deleting registration:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}