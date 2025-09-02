import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/custom-auth'
import dbConnect from '@/lib/db'
import { UserModel } from '@/models/User'
import { RegistrationModel } from '@/models/Registration'
import { z } from 'zod'

const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'admin' && session.user.id !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await dbConnect()
    
    const user = await UserModel.findById(params.id).lean()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const registrations = await RegistrationModel.find({ userId: params.id })
      .populate('raceId', 'name location startDate status')
      .lean()

    const stats = {
      totalRaces: registrations.length,
      completedRaces: registrations.filter(r => r.finishTime).length,
      avgPosition: registrations.filter(r => r.position).reduce((acc, r) => acc + (r.position || 0), 0) / registrations.filter(r => r.position).length || null,
      bestTime: Math.min(...registrations.filter(r => r.finishTime).map(r => r.finishTime || Infinity))
    }

    return NextResponse.json({
      user,
      registrations,
      stats
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.id !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await dbConnect()

    const body = await request.json()
    const validatedData = UpdateUserSchema.parse(body)

    const user = await UserModel.findByIdAndUpdate(
      params.id,
      validatedData,
      { new: true, runValidators: true }
    ).lean()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}