import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { z } from 'zod'
import { ContactModel } from '@/models/Contact'
import { getSession } from '@/lib/custom-auth'

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().max(150).optional().nullable(),
  message: z.string().min(10).max(5000),
})

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const session = await getSession().catch(() => null)
    const body = await request.json()
    const data = ContactSchema.parse(body)

    const doc = await ContactModel.create({
      ...data,
      userId: session?.user?.id ?? null,
    })

    return NextResponse.json({ id: doc._id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error submitting contact form:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}




