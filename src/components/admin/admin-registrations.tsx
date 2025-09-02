'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Users, Search, Filter, Download, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
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
  }
  registeredAt: string
  status: 'pending' | 'approved' | 'rejected'
  finishTime?: number
  position?: number
}

export function AdminRegistrations() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [raceFilter, setRaceFilter] = useState<string>('all')
  const queryClient = useQueryClient()

  const { data: registrations, isLoading } = useQuery<Registration[]>({
    queryKey: ['admin-registrations'],
    queryFn: async () => {
      const response = await fetch('/api/registrations')
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

  const updateRegistrationMutation = useMutation({
    mutationFn: async ({ registrationId, status }: { registrationId: string, status: string }) => {
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!response.ok) throw new Error('Failed to update registration')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-registrations'] })
    }
  })

  const filteredRegistrations = registrations?.filter(registration => {
    const matchesSearch = 
      registration.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.raceId.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || registration.status === statusFilter
    const matchesRace = raceFilter === 'all' || registration.raceId._id === raceFilter

    return matchesSearch && matchesStatus && matchesRace
  }) || []

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    }
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleStatusUpdate = (registrationId: string, newStatus: string) => {
    updateRegistrationMutation.mutate({ registrationId, status: newStatus })
  }

  const exportRegistrations = () => {
    const csvContent = [
      ['Name', 'Email', 'Race', 'Location', 'Registration Date', 'Status', 'Finish Time', 'Position'].join(','),
      ...filteredRegistrations.map(reg => [
        reg.userId.name,
        reg.userId.email,
        reg.raceId.name,
        reg.raceId.location,
        format(new Date(reg.registeredAt), 'yyyy-MM-dd HH:mm'),
        reg.status,
        reg.finishTime ? `${reg.finishTime}s` : '',
        reg.position || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `registrations-${format(new Date(), 'yyyy-MM-dd')}.csv`
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registration Management</h1>
          <p className="text-muted-foreground">
            Manage race registrations and participant approvals
          </p>
        </div>
        <Button onClick={exportRegistrations} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registrations?.filter(r => r.status === 'approved').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registrations?.filter(r => r.status === 'pending').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registrations?.filter(r => r.status === 'rejected').length || 0}
            </div>
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
                  placeholder="Search by name, email, or race..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={raceFilter} onValueChange={setRaceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Race" />
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
          <CardTitle>Registrations ({filteredRegistrations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No registrations found</h3>
              <p className="text-muted-foreground">
                No registrations match your current filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Race</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Finish Time</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration) => (
                    <TableRow key={registration._id}>
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
                        {format(new Date(registration.registeredAt), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(registration.status)}
                          {getStatusBadge(registration.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {registration.finishTime ? `${registration.finishTime}s` : '-'}
                      </TableCell>
                      <TableCell>
                        {registration.position ? `#${registration.position}` : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {registration.status !== 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(registration._id, 'approved')}
                              disabled={updateRegistrationMutation.isPending}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          {registration.status !== 'rejected' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(registration._id, 'rejected')}
                              disabled={updateRegistrationMutation.isPending}
                            >
                              <XCircle className="h-3 w-3" />
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

      {updateRegistrationMutation.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to update registration status. Please try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}