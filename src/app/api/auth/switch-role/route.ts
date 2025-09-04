import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/custom-auth'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { role } = body

    if (!role || !['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Create new token with updated role
    const newToken = jwt.sign(
      {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: role,
        image: session.user.image
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Set the new token in cookies
    const cookieStore = await cookies()
    cookieStore.set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return NextResponse.json({ 
      message: 'Role updated successfully',
      role: role 
    })
  } catch (error) {
    console.error('Error switching role:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


