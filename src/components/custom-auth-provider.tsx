'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthUser, Session } from '@/lib/custom-auth'
import { isAuthDisabled, createMockSession } from '@/lib/dev-auth'

interface AuthContextType {
  data: Session | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function CustomAuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')

  useEffect(() => {
    const fetchSession = async () => {
      if (isAuthDisabled) {
        const mockSession = createMockSession()
        setSession(mockSession)
        setStatus('authenticated')
        return
      }

      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        
        if (data.session) {
          setSession(data.session)
          setStatus('authenticated')
        } else {
          setSession(null)
          setStatus('unauthenticated')
        }
      } catch (error) {
        console.error('Failed to fetch session:', error)
        setSession(null)
        setStatus('unauthenticated')
      }
    }

    fetchSession()
  }, [])

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        const newSession: Session = {
          user: data.user,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
        setSession(newSession)
        setStatus('authenticated')
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'An error occurred. Please try again.' }
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      setSession(null)
      setStatus('unauthenticated')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const value: AuthContextType = {
    data: session,
    status,
    signIn,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useCustomAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useCustomAuth must be used within a CustomAuthProvider')
  }
  return context
}