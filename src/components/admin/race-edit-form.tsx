'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import Link from 'next/link'

interface RaceFormData {
  name: string
  description: string
  location: string
  startDate: string
  endDate: string
  registrationDeadline: string
  maxParticipants: string
  status: 'upcoming' | 'registration_open' | 'registration_closed' | 'ongoing' | 'completed'
}

interface RaceEditFormProps {
  raceId: string
}

export function RaceEditForm({ raceId }: RaceEditFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<RaceFormData>({
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxParticipants: '',
    status: 'upcoming'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: race, isLoading, error } = useQuery({
    queryKey: ['race', raceId],
    queryFn: async () => {
      const response = await fetch(`/api/races/${raceId}`)
      if (!response.ok) throw new Error('Failed to fetch race')
      return response.json()
    }
  })

  const updateRaceMutation = useMutation({
    mutationFn: async (data: Partial<RaceFormData>) => {
      const response = await fetch(`/api/races/${raceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : undefined
        })
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update race')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['race', raceId] })
      queryClient.invalidateQueries({ queryKey: ['races'] })
      router.push('/admin/races')
    }
  })

  const deleteRaceMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/races/${raceId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete race')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['races'] })
      router.push('/admin/races')
    }
  })

  useEffect(() => {
    if (race) {
      setFormData({
        name: race.name || '',
        description: race.description || '',
        location: race.location || '',
        startDate: race.startDate ? new Date(race.startDate).toISOString().slice(0, 16) : '',
        endDate: race.endDate ? new Date(race.endDate).toISOString().slice(0, 16) : '',
        registrationDeadline: race.registrationDeadline ? new Date(race.registrationDeadline).toISOString().slice(0, 16) : '',
        maxParticipants: race.maxParticipants?.toString() || '',
        status: race.status || 'upcoming'
      })
    }
  }, [race])

  const handleChange = (field: keyof RaceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Race name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'
    if (!formData.registrationDeadline) newErrors.registrationDeadline = 'Registration deadline is required'

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date'
    }

    if (formData.registrationDeadline && formData.startDate && new Date(formData.registrationDeadline) >= new Date(formData.startDate)) {
      newErrors.registrationDeadline = 'Registration deadline must be before start date'
    }

    if (formData.maxParticipants && parseInt(formData.maxParticipants) <= 0) {
      newErrors.maxParticipants = 'Maximum participants must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      updateRaceMutation.mutate(formData)
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this race? This action cannot be undone.')) {
      deleteRaceMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load race data. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/admin/races">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Races
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Race</h1>
            <p className="text-muted-foreground">
              Update race details and settings
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteRaceMutation.isPending}
          >
            {deleteRaceMutation.isPending ? 'Deleting...' : 'Delete Race'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Race Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Race Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter race name"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Enter race location"
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter race description"
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date & Time *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date & Time *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
                {errors.endDate && (
                  <p className="text-sm text-destructive">{errors.endDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationDeadline">Registration Deadline *</Label>
                <Input
                  id="registrationDeadline"
                  type="datetime-local"
                  value={formData.registrationDeadline}
                  onChange={(e) => handleChange('registrationDeadline', e.target.value)}
                />
                {errors.registrationDeadline && (
                  <p className="text-sm text-destructive">{errors.registrationDeadline}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => handleChange('maxParticipants', e.target.value)}
                  placeholder="Leave empty for unlimited"
                />
                {errors.maxParticipants && (
                  <p className="text-sm text-destructive">{errors.maxParticipants}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="registration_open">Registration Open</SelectItem>
                    <SelectItem value="registration_closed">Registration Closed</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                type="submit" 
                disabled={updateRaceMutation.isPending}
                className="flex-1"
              >
                <Save className="mr-2 h-4 w-4" />
                {updateRaceMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {updateRaceMutation.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {updateRaceMutation.error.message}
          </AlertDescription>
        </Alert>
      )}

      {deleteRaceMutation.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {deleteRaceMutation.error.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}