'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { useRaces } from '@/lib/queries'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { format } from 'date-fns'

export function FeaturedRaces() {
  const { data: races, isLoading, error } = useRaces({ 
    status: 'registration_open' 
  })

  const featuredRaces = races?.slice(0, 3) || []

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center">
            <LoadingSpinner />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center">
            <p className="text-muted-foreground">Unable to load featured races</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Races
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            Don't miss these upcoming mountain running adventures. Registration is now open!
          </p>
        </div>

        {featuredRaces.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No races currently open for registration</p>
            <Button variant="outline" asChild>
              <Link href="/races">View All Races</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredRaces.map((race) => (
                <Card key={race._id.toString()} className="overflow-hidden transition-all hover:shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="mb-2">
                        {race.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        Featured
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold leading-tight">
                      {race.name}
                    </h3>
                  </CardHeader>
                  
                  <CardContent className="pb-4">
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(race.startDate), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{race.location}</span>
                      </div>
                      {race.maxParticipants && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>Max {race.maxParticipants} participants</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                      {race.description}
                    </p>
                  </CardContent>
                  
                  <CardFooter>
                    <Button className="w-full group" asChild>
                      <Link href={`/races/${race._id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/races">
                  View All Races
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}