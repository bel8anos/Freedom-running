'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Trophy, Clock, User, Target, Award, TrendingUp } from 'lucide-react'
import { useRaces } from '@/lib/queries'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { format } from 'date-fns'

export function UserDashboard() {
  const { data: session } = useAuth()
  const { data: races, isLoading } = useRaces()

  // Mock user registrations and stats - in real app, fetch from API
  const userRegistrations = []
  const userStats = {
    totalRaces: 0,
    completedRaces: 0,
    upcomingRaces: 0,
    bestTime: null,
    avgPosition: null
  }

  const featuredRaces = races?.filter(race => 
    race.status === 'registration_open' || race.status === 'upcoming'
  ).slice(0, 3) || []

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Ready for your next mountain running adventure?
          </p>
        </div>
        <Button asChild>
          <Link href="/races">
            Explore Races
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Races</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalRaces}</div>
            <p className="text-xs text-muted-foreground">
              Races participated in
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.completedRaces}</div>
            <p className="text-xs text-muted-foreground">
              Races finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.upcomingRaces}</div>
            <p className="text-xs text-muted-foreground">
              Races registered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.avgPosition ? `#${userStats.avgPosition}` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average position
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* My Races */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>My Races</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userRegistrations.length === 0 ? (
              <div className="py-8 text-center">
                <Award className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No races yet</h3>
                <p className="text-muted-foreground">
                  Start your mountain running journey by registering for a race!
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/races">Browse Races</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {userRegistrations.map((registration: any) => (
                  <div key={registration._id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium leading-none">{registration.race.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {registration.race.location} • {format(new Date(registration.race.startDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Badge variant={
                      registration.status === 'approved' ? 'default' :
                      registration.status === 'pending' ? 'secondary' :
                      'destructive'
                    }>
                      {registration.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Races */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Recommended Races</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {featuredRaces.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No races available</h3>
                <p className="text-muted-foreground">
                  Check back later for new mountain running opportunities!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {featuredRaces.map((race) => (
                  <div key={race._id.toString()} className="space-y-3 border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium leading-none">{race.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{race.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{format(new Date(race.startDate), 'MMM dd')}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        race.status === 'registration_open' ? 'default' : 'secondary'
                      }>
                        {race.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/races/${race._id}`}>View Details</Link>
                      </Button>
                      {race.status === 'registration_open' && (
                        <Button size="sm" asChild>
                          <Link href={`/races/${race._id}#register`}>Register</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="pt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/races">View All Races</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/races">
                <Calendar className="mr-2 h-4 w-4" />
                Browse All Races
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/races?status=registration_open">
                <Target className="mr-2 h-4 w-4" />
                Open Registrations
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/help">
                <Trophy className="mr-2 h-4 w-4" />
                Race Guidelines
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}