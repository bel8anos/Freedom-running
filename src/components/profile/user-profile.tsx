'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Calendar, Trophy, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export function UserProfile() {
  const { data: session } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    bio: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/users/${session?.user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setIsEditing(false)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // Mock user data - in real app, fetch from API
  const userStats = {
    totalRaces: 0,
    completedRaces: 0,
    totalDistance: 0,
    totalTime: 0,
    bestPosition: null,
    achievements: []
  }

  const recentRaces = []

  // Fetch current user's registrations for "My Registrations" list
  type RegistrationItem = {
    _id: string
    registeredAt: string
    status: 'pending' | 'approved' | 'rejected'
    raceId: {
      _id: string
      name: string
      location: string
      startDate: string
    }
  }

  const { data: myRegistrations = [], isLoading: isRegLoading } = useQuery<RegistrationItem[]>({
    queryKey: ['my-registrations'],
    queryFn: async () => {
      const res = await fetch('/api/registrations')
      if (!res.ok) throw new Error('Failed to fetch registrations')
      return res.json()
    },
    enabled: Boolean(session?.user?.id),
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and view your running history
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {message && (
                <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                  {message.type === 'error' ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                  <AvatarFallback className="text-lg">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{session?.user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={session?.user?.role === 'admin' ? 'default' : 'secondary'}>
                      {session?.user?.role === 'admin' ? 'Administrator' : 'Runner'}
                    </Badge>
                    <Badge variant="outline">
                      Member since {new Date().getFullYear()}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about your running journey..."
                      rows={4}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="mt-1">{session?.user?.email}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
                    <p className="mt-1 text-muted-foreground">
                      {formData.bio || 'No bio added yet. Click edit to add one!'}
                    </p>
                  </div>

                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentRaces.length === 0 ? (
                <div className="py-8 text-center">
                  <Trophy className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No activity yet</h3>
                  <p className="text-muted-foreground">
                    Start participating in races to see your activity here!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentRaces.map((race: any) => (
                    <div key={race.id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="font-medium">{race.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{race.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{race.date}</span>
                          </div>
                        </div>
                      </div>
                      <Badge>{race.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Registrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>My Registrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isRegLoading ? (
                <div className="py-8 text-center">
                  Loading registrations...
                </div>
              ) : myRegistrations.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  You haven't registered for any races yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {myRegistrations.map((reg) => (
                    <div key={reg._id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="font-medium">{reg.raceId.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{reg.raceId.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(reg.raceId.startDate).toDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          reg.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : reg.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats.totalRaces}</div>
                  <div className="text-xs text-muted-foreground">Total Races</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats.completedRaces}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userStats.totalDistance}</div>
                  <div className="text-xs text-muted-foreground">Total KM</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {userStats.bestPosition || 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">Best Position</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              {userStats.achievements.length === 0 ? (
                <div className="py-4 text-center">
                  <Trophy className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No achievements yet. Keep racing!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {userStats.achievements.map((achievement: any) => (
                    <div key={achievement.id} className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{achievement.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}