'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Race } from '@/types'
import { useRegisterForRace } from '@/lib/queries'
import { format } from 'date-fns'
import Link from 'next/link'

interface RegistrationSectionProps {
  race: Race & { registrationCount?: number; userRegistration?: any }
}

export function RegistrationSection({ race }: RegistrationSectionProps) {
  const { data: session } = useAuth()
  const [isRegistering, setIsRegistering] = useState(false)
  const registerMutation = useRegisterForRace()

  const isRegistrationOpen = () => {
    return race.status === 'registration_open' && 
           new Date() <= new Date(race.registrationDeadline)
  }

  const isRaceFull = () => {
    return race.maxParticipants && 
           (race.registrationCount || 0) >= race.maxParticipants
  }

  const handleRegister = async () => {
    if (!session) return
    
    setIsRegistering(true)
    try {
      await registerMutation.mutateAsync(race._id.toString())
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsRegistering(false)
    }
  }

  const getRegistrationStatus = () => {
    if (!session) {
      return { type: 'signin', message: 'Sign in to register for this race' }
    }

    if (race.userRegistration) {
      return { 
        type: 'registered', 
        message: `You are registered for this race (${race.userRegistration.status})` 
      }
    }

    if (!isRegistrationOpen()) {
      if (race.status === 'registration_closed') {
        return { type: 'closed', message: 'Registration is closed for this race' }
      }
      if (race.status === 'completed') {
        return { type: 'completed', message: 'This race has been completed' }
      }
      if (race.status === 'ongoing') {
        return { type: 'ongoing', message: 'This race is currently ongoing' }
      }
      return { type: 'upcoming', message: 'Registration is not yet open' }
    }

    if (isRaceFull()) {
      return { type: 'full', message: 'This race is full' }
    }

    return { type: 'open', message: 'Registration is open!' }
  }

  const status = getRegistrationStatus()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Registration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge 
                variant={status.type === 'open' ? 'default' : 'secondary'}
                className={
                  status.type === 'open' ? 'bg-green-100 text-green-800' :
                  status.type === 'registered' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }
              >
                {race.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Participants</span>
              <span className="text-sm">
                {race.registrationCount || 0}
                {race.maxParticipants ? ` / ${race.maxParticipants}` : ''}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Deadline</span>
              <span className="text-sm">
                {format(new Date(race.registrationDeadline), 'MMM dd')}
              </span>
            </div>
          </div>

          <Alert>
            {status.type === 'open' ? (
              <CheckCircle className="h-4 w-4" />
            ) : status.type === 'registered' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>

          {status.type === 'signin' ? (
            <Button className="w-full" asChild>
              <Link href="/auth/signin">Sign In to Register</Link>
            </Button>
          ) : status.type === 'open' ? (
            <Button 
              className="w-full" 
              onClick={handleRegister}
              disabled={isRegistering || registerMutation.isPending}
            >
              {isRegistering || registerMutation.isPending ? 'Registering...' : 'Register Now'}
            </Button>
          ) : status.type === 'registered' ? (
            <Button className="w-full" variant="outline" disabled>
              Already Registered
            </Button>
          ) : (
            <Button className="w-full" variant="outline" disabled>
              Registration Unavailable
            </Button>
          )}

          {registerMutation.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Registration failed. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Important Dates</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Registration Deadline</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(race.registrationDeadline), 'EEEE, MMMM dd, yyyy')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Race Start</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(race.startDate), 'EEEE, MMMM dd, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium">Race End</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(race.endDate), 'EEEE, MMMM dd, yyyy')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}