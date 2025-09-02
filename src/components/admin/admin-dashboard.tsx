'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar, Users, Trophy, BarChart3 } from 'lucide-react'
import { useRaces } from '@/lib/queries'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { format } from 'date-fns'

export function AdminDashboard() {
  const { data: races, isLoading } = useRaces()

  const stats = {
    totalRaces: races?.length || 0,
    upcomingRaces: races?.filter(r => r.status === 'upcoming' || r.status === 'registration_open').length || 0,
    ongoingRaces: races?.filter(r => r.status === 'ongoing').length || 0,
    completedRaces: races?.filter(r => r.status === 'completed').length || 0,
  }

  const recentRaces = races?.slice(0, 5) || []

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage races, registrations, and platform settings
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/races/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Race
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Races</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRaces}</div>
            <p className="text-xs text-muted-foreground">
              All time races created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Races</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingRaces}</div>
            <p className="text-xs text-muted-foreground">
              Races accepting registrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing Races</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ongoingRaces}</div>
            <p className="text-xs text-muted-foreground">
              Currently active races
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Races</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedRaces}</div>
            <p className="text-xs text-muted-foreground">
              Finished races with results
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Races</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRaces.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No races created yet
              </p>
            ) : (
              recentRaces.map((race) => (
                <div key={race._id.toString()} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium leading-none">{race.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {race.location} • {format(new Date(race.startDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      race.status === 'registration_open' ? 'default' :
                      race.status === 'ongoing' ? 'secondary' :
                      race.status === 'completed' ? 'outline' :
                      'secondary'
                    }>
                      {race.status.replace('_', ' ')}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/races/${race._id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
            <div className="pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/races">View All Races</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href="/admin/races/create">
                <Plus className="mr-2 h-4 w-4" />
                Create New Race
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/races">
                <Calendar className="mr-2 h-4 w-4" />
                Manage All Races
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/registrations">
                <Users className="mr-2 h-4 w-4" />
                View Registrations
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/results">
                <Trophy className="mr-2 h-4 w-4" />
                Manage Results
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}