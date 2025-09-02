'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Trophy, Search, Download, Edit, Plus, Clock, Medal, Target, AlertCircle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { format } from 'date-fns'

interface Registration {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
  }
  raceId: {
    _id: string
    name: string
    location: string
    startDate: string
    status: string
  }
  registeredAt: string
  status: 'pending' | 'approved' | 'rejected'
  finishTime?: number
  position?: number
}

interface ResultFormData {
  registrationId: string
  finishTime: string
  position: string
}

export function AdminResults() {
  const [searchTerm, setSearchTerm] = useState('')
  const [raceFilter, setRaceFilter] = useState<string>('all')
  const [resultDialog, setResultDialog] = useState(false)
  const [editingResult, setEditingResult] = useState<Registration | null>(null)
  const [formData, setFormData] = useState<ResultFormData>({
    registrationId: '',
    finishTime: '',
    position: ''
  })
  const queryClient = useQueryClient()

  const { data: registrations, isLoading } = useQuery<Registration[]>({
    queryKey: ['admin-results'],
    queryFn: async () => {
      const response = await fetch('/api/registrations?status=approved')
      if (!response.ok) throw new Error('Failed to fetch registrations')
      return response.json()
    }
  })

  const { data: races } = useQuery({
    queryKey: ['races'],
    queryFn: async () => {
      const response = await fetch('/api/races')
      if (!response.ok) throw new Error('Failed to fetch races')
      return response.json()
    }
  })

  const updateResultMutation = useMutation({
    mutationFn: async (data: { registrationId: string, finishTime?: number, position?: number }) => {
      const response = await fetch(`/api/registrations/${data.registrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finishTime: data.finishTime,
          position: data.position
        })
      })
      if (!response.ok) throw new Error('Failed to update result')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-results'] })
      setResultDialog(false)
      setEditingResult(null)
      setFormData({ registrationId: '', finishTime: '', position: '' })
    }
  })

  const filteredRegistrations = registrations?.filter(registration => {
    const matchesSearch = 
      registration.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.raceId.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRace = raceFilter === 'all' || registration.raceId._id === raceFilter

    return matchesSearch && matchesRace
  }) || []

  const completedRaces = races?.filter((race: any) => 
    race.status === 'completed' || race.status === 'ongoing'
  ) || []

  const handleEditResult = (registration: Registration) => {
    setEditingResult(registration)
    setFormData({
      registrationId: registration._id,
      finishTime: registration.finishTime?.toString() || '',
      position: registration.position?.toString() || ''
    })
    setResultDialog(true)
  }

  const handleAddResult = (registration: Registration) => {
    setEditingResult(null)
    setFormData({
      registrationId: registration._id,
      finishTime: '',
      position: ''
    })
    setResultDialog(true)
  }

  const handleSubmitResult = () => {
    const finishTime = formData.finishTime ? parseFloat(formData.finishTime) : undefined
    const position = formData.position ? parseInt(formData.position) : undefined

    updateResultMutation.mutate({
      registrationId: formData.registrationId,
      finishTime,
      position
    })
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const exportResults = () => {
    const csvContent = [
      ['Race', 'Participant', 'Email', 'Position', 'Finish Time', 'Registration Date'].join(','),
      ...filteredRegistrations
        .filter(reg => reg.finishTime || reg.position)
        .sort((a, b) => (a.position || 999) - (b.position || 999))
        .map(reg => [
          reg.raceId.name,
          reg.userId.name,
          reg.userId.email,
          reg.position || '',
          reg.finishTime ? formatTime(reg.finishTime) : '',
          format(new Date(reg.registeredAt), 'yyyy-MM-dd')
        ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `race-results-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const totalParticipants = filteredRegistrations.length
  const completedParticipants = filteredRegistrations.filter(r => r.finishTime).length
  const averageTime = filteredRegistrations
    .filter(r => r.finishTime)
    .reduce((acc, r) => acc + (r.finishTime || 0), 0) / completedParticipants || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Race Results Management</h1>
          <p className="text-muted-foreground">
            Manage race results, finish times, and participant rankings
          </p>
        </div>
        <Button onClick={exportResults} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Results
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finished</CardTitle>
            <Trophy className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedParticipants}</div>
            <p className="text-xs text-muted-foreground">
              {totalParticipants > 0 ? `${Math.round((completedParticipants / totalParticipants) * 100)}% completion` : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageTime > 0 ? formatTime(Math.round(averageTime)) : '-'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Races</CardTitle>
            <Medal className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRaces.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by participant or race name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={raceFilter} onValueChange={setRaceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Race" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Races</SelectItem>
                {races?.map((race: any) => (
                  <SelectItem key={race._id} value={race._id}>
                    {race.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results ({filteredRegistrations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No participants found</h3>
              <p className="text-muted-foreground">
                No approved participants match your current filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Participant</TableHead>
                    <TableHead>Race</TableHead>
                    <TableHead>Finish Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations
                    .sort((a, b) => {
                      if (a.position && b.position) return a.position - b.position
                      if (a.position) return -1
                      if (b.position) return 1
                      return 0
                    })
                    .map((registration) => (
                    <TableRow key={registration._id}>
                      <TableCell>
                        {registration.position ? (
                          <div className="flex items-center space-x-2">
                            {registration.position <= 3 && (
                              <Medal className={`h-4 w-4 ${
                                registration.position === 1 ? 'text-yellow-500' :
                                registration.position === 2 ? 'text-gray-400' :
                                'text-amber-600'
                              }`} />
                            )}
                            <span className="font-medium">#{registration.position}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{registration.userId.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {registration.userId.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{registration.raceId.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {registration.raceId.location} • {format(new Date(registration.raceId.startDate), 'MMM dd, yyyy')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {registration.finishTime ? (
                          <div className="font-mono">{formatTime(registration.finishTime)}</div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={registration.raceId.status === 'completed' ? 'default' : 'secondary'}>
                          {registration.raceId.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {registration.finishTime || registration.position ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditResult(registration)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleAddResult(registration)}
                            >
                              <Plus className="mr-1 h-3 w-3" />
                              Add Result
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={resultDialog} onOpenChange={setResultDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingResult ? 'Edit Result' : 'Add Result'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                type="number"
                placeholder="e.g., 1, 2, 3..."
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="finishTime">Finish Time (seconds)</Label>
              <Input
                id="finishTime"
                type="number"
                step="0.1"
                placeholder="e.g., 3600 (1 hour)"
                value={formData.finishTime}
                onChange={(e) => setFormData(prev => ({ ...prev, finishTime: e.target.value }))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter time in seconds (e.g., 3600 = 1 hour)
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleSubmitResult}
                disabled={updateResultMutation.isPending}
                className="flex-1"
              >
                {updateResultMutation.isPending ? 'Saving...' : 'Save Result'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setResultDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {updateResultMutation.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to update result. Please try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}