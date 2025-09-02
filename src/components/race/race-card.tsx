import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { Race } from '@/types'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface RaceCardProps {
  race: Race
  variant?: 'default' | 'compact' | 'detailed'
  showActions?: boolean
}

export function RaceCard({ race, variant = 'default', showActions = false }: RaceCardProps) {
  const getStatusColor = (status: Race['status']) => {
    switch (status) {
      case 'registration_open':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'registration_closed':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'completed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  const isRegistrationOpen = () => {
    return race.status === 'registration_open' && 
           new Date() <= new Date(race.registrationDeadline)
  }

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      variant === 'compact' && "p-4",
      variant === 'detailed' && "p-6"
    )}>
      <CardHeader className={variant === 'compact' ? 'pb-2' : 'pb-4'}>
        <div className="flex items-start justify-between">
          <Badge className={getStatusColor(race.status)}>
            {race.status.replace('_', ' ').toUpperCase()}
          </Badge>
          {isRegistrationOpen() && (
            <Badge variant="outline" className="border-green-500 text-green-700">
              Open
            </Badge>
          )}
        </div>
        <h3 className={cn(
          "font-semibold leading-tight",
          variant === 'compact' ? 'text-lg' : 'text-xl'
        )}>
          {race.name}
        </h3>
      </CardHeader>
      
      <CardContent className={variant === 'compact' ? 'pb-2' : 'pb-4'}>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(race.startDate), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{race.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>
              Registration until {format(new Date(race.registrationDeadline), 'MMM dd')}
            </span>
          </div>
          {race.maxParticipants && (
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Max {race.maxParticipants} participants</span>
            </div>
          )}
        </div>
        
        {variant !== 'compact' && (
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {race.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className={variant === 'compact' ? 'pt-2' : 'pt-4'}>
        <div className="flex w-full gap-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/races/${race._id}`}>
              View Details
            </Link>
          </Button>
          {isRegistrationOpen() && (
            <Button className="flex-1" asChild>
              <Link href={`/races/${race._id}#register`}>
                Register
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}