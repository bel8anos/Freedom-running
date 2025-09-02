import { NextResponse } from 'next/server'
import { getSession } from '@/lib/custom-auth'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { session: null },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { session },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}