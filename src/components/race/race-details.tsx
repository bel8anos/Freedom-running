import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Clock, User } from 'lucide-react'
import { Race } from '@/types'
import { format } from 'date-fns'

interface RaceDetailsProps {
  race: Race & { registrationCount?: number }
}

export function RaceDetails({ race }: RaceDetailsProps) {
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

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 flex items-center space-x-2">
          <Badge className={getStatusColor(race.status)}>
            {race.status.replace('_', ' ').toUpperCase()}
          </Badge>
          {race.status === 'registration_open' && new Date() <= new Date(race.registrationDeadline) && (
            <Badge variant="outline" className="border-green-500 text-green-700">
              Registration Open
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
          {race.name}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Race Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Start Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(race.startDate), 'EEEE, MMMM dd, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Start Time</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(race.startDate), 'h:mm a')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{race.location}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Participants</p>
                <p className="text-sm text-muted-foreground">
                  {race.registrationCount || 0}
                  {race.maxParticipants ? ` / ${race.maxParticipants}` : ''} registered
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Registration Deadline</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(race.registrationDeadline), 'MMMM dd, yyyy')}
                </p>
              </div>
            </div>

            {race.createdBy && typeof race.createdBy === 'object' && 'name' in race.createdBy && (
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Organizer</p>
                  <p className="text-sm text-muted-foreground">
                    {race.createdBy.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-muted-foreground">
              {race.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {race.image && (
        <Card>
          <CardHeader>
            <CardTitle>Race Image</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={race.image}
              alt={race.name}
              className="w-full rounded-lg object-cover"
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}