'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCreateRace, useUpdateRace } from '@/lib/queries'
import { Race } from '@/types'
import { AlertCircle } from 'lucide-react'

const raceFormSchema = z.object({
  name: z.string().min(1, 'Race name is required').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.string().min(1, 'End date is required'),
  endTime: z.string().min(1, 'End time is required'),
  registrationDeadline: z.string().min(1, 'Registration deadline is required'),
  maxParticipants: z.coerce.number().min(1).optional(),
  status: z.enum(['upcoming', 'registration_open', 'registration_closed', 'ongoing', 'completed']),
  image: z.string().url().optional().or(z.literal('')),
}).refine((data) => {
  const startDate = new Date(data.startDate)
  const endDate = new Date(data.endDate)
  const regDeadline = new Date(data.registrationDeadline)
  
  return endDate >= startDate && regDeadline <= startDate
}, {
  message: "End date must be after start date, and registration deadline must be before start date",
  path: ["endDate"]
})

type RaceFormData = z.infer<typeof raceFormSchema>

interface RaceFormProps {
  race?: Race
  isEditing?: boolean
}

export function RaceForm({ race, isEditing = false }: RaceFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const createRaceMutation = useCreateRace()
  const updateRaceMutation = useUpdateRace()

  const form = useForm<RaceFormData>({
    resolver: zodResolver(raceFormSchema),
    defaultValues: {
      name: race?.name || '',
      description: race?.description || '',
      location: race?.location || '',
      startDate: race?.startDate ? new Date(race.startDate).toISOString().slice(0, 10) : '',
      startTime: race?.startDate ? new Date(race.startDate).getHours().toString().padStart(2, '0') : '08',
      endDate: race?.endDate ? new Date(race.endDate).toISOString().slice(0, 10) : '',
      endTime: race?.endDate ? new Date(race.endDate).getHours().toString().padStart(2, '0') : '18',
      registrationDeadline: race?.registrationDeadline ? new Date(race.registrationDeadline).toISOString().slice(0, 10) : '',
      maxParticipants: race?.maxParticipants || undefined,
      status: race?.status || 'upcoming',
      image: race?.image || '',
    },
  })

  const onSubmit = async (data: RaceFormData) => {
    setIsSubmitting(true)
    
    try {
      const raceData = {
        ...data,
        startDate: new Date(data.startDate + 'T' + data.startTime + ':00:00').toISOString(),
        endDate: new Date(data.endDate + 'T' + data.endTime + ':00:00').toISOString(),
        registrationDeadline: new Date(data.registrationDeadline + 'T23:59:59').toISOString(),
        image: data.image || undefined,
        maxParticipants: data.maxParticipants || undefined,
      }

      if (isEditing && race) {
        await updateRaceMutation.mutateAsync({
          id: race._id.toString(),
          race: raceData
        })
      } else {
        await createRaceMutation.mutateAsync(raceData)
      }
      
      router.push('/admin/races')
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const mutation = isEditing ? updateRaceMutation : createRaceMutation

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Race' : 'Create New Race'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Race Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter race name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the race, terrain, difficulty, and what participants can expect..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location (e.g., Mount Olympus, Greece)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time (Hour)</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                              {i.toString().padStart(2, '0')}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time (Hour)</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                              {i.toString().padStart(2, '0')}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="registrationDeadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Deadline</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Participants (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Leave empty for unlimited"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="registration_open">Registration Open</SelectItem>
                        <SelectItem value="registration_closed">Registration Closed</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Race Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/race-image.jpg"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mutation.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to {isEditing ? 'update' : 'create'} race. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting || mutation.isPending}
                className="flex-1"
              >
                {isSubmitting || mutation.isPending 
                  ? (isEditing ? 'Updating...' : 'Creating...') 
                  : (isEditing ? 'Update Race' : 'Create Race')
                }
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting || mutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}