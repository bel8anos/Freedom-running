import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import dbConnect from './db'
import { UserModel } from '@/models/User'
import { User } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || []

export interface AuthUser {
  id: string
  email: string
  name: string
  image?: string | null
  role: 'user' | 'admin'
}

export interface Session {
  user: AuthUser
  expires: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      image: decoded.image || null,
      role: decoded.role
    }
  } catch {
    return null
  }
}

export async function signIn(email: string, password: string): Promise<AuthUser | null> {
  try {
    await dbConnect()
    
    const user = await UserModel.findOne({ 
      email: email.toLowerCase() 
    }).select('+password')

    if (!user || !user.password) {
      return null
    }

    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return null
    }

    const role = ADMIN_EMAILS.includes(user.email) ? 'admin' : 'user'

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      image: user.image,
      role
    }
  } catch (error) {
    console.error('Sign in error:', error)
    return null
  }
}

export async function signUp(name: string, email: string, password: string): Promise<AuthUser | null> {
  try {
    await dbConnect()

    const existingUser = await UserModel.findOne({ 
      email: email.toLowerCase() 
    })

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    const hashedPassword = await hashPassword(password)
    const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user'

    const user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role
    })

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      image: user.image,
      role
    }
  } catch (error) {
    console.error('Sign up error:', error)
    throw error
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const user = verifyToken(token)
    if (!user) {
      return null
    }

    return {
      user,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  } catch {
    return null
  }
}

export async function setAuthCookie(user: AuthUser): Promise<void> {
  const token = generateToken(user)
  const cookieStore = await cookies()
  
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  })
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}