import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Race, RaceFilters, Registration, User } from '@/types'

export const raceQueries = {
  all: () => ['races'] as const,
  lists: () => [...raceQueries.all(), 'list'] as const,
  list: (filters: RaceFilters) => [...raceQueries.lists(), filters] as const,
  detail: (id: string) => [...raceQueries.all(), 'detail', id] as const,
}

export const registrationQueries = {
  all: () => ['registrations'] as const,
  lists: () => [...registrationQueries.all(), 'list'] as const,
  userRaces: (userId: string) => [...registrationQueries.all(), 'user', userId] as const,
  raceRegistrations: (raceId: string) => [...registrationQueries.all(), 'race', raceId] as const,
}

export const userQueries = {
  all: () => ['users'] as const,
  profile: (id: string) => [...userQueries.all(), 'profile', id] as const,
  stats: (id: string) => [...userQueries.all(), 'stats', id] as const,
}

const API_BASE = '/api'

async function fetchRaces(filters: RaceFilters = {}): Promise<Race[]> {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value)
  })
  
  const response = await fetch(`${API_BASE}/races?${params}`)
  if (!response.ok) throw new Error('Failed to fetch races')
  return response.json()
}

async function fetchRace(id: string): Promise<Race> {
  const response = await fetch(`${API_BASE}/races/${id}`)
  if (!response.ok) throw new Error('Failed to fetch race')
  return response.json()
}

async function createRace(race: Omit<Race, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<Race> {
  const response = await fetch(`${API_BASE}/races`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(race),
  })
  if (!response.ok) throw new Error('Failed to create race')
  return response.json()
}

async function updateRace(id: string, race: Partial<Race>): Promise<Race> {
  const response = await fetch(`${API_BASE}/races/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(race),
  })
  if (!response.ok) throw new Error('Failed to update race')
  return response.json()
}

async function deleteRace(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/races/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete race')
}

async function registerForRace(raceId: string): Promise<Registration> {
  const response = await fetch(`${API_BASE}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raceId }),
  })
  if (!response.ok) {
    let errorMessage = `Failed to register for race (HTTP ${response.status})`
    try {
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await response.json() as any
        if (typeof data?.error === 'string') {
          errorMessage = data.error
        } else if (Array.isArray(data?.error) && data.error[0]?.message) {
          errorMessage = data.error[0].message
        }
      } else {
        const text = await response.text()
        if (text) errorMessage = `${errorMessage}: ${text.substring(0, 200)}`
      }
    } catch (e) {
      // ignore parse failures; keep the default errorMessage
    }
    throw new Error(errorMessage)
  }
  return response.json()
}

export const useRaces = (filters: RaceFilters = {}) => {
  return useQuery({
    queryKey: raceQueries.list(filters),
    queryFn: () => fetchRaces(filters),
  })
}

export const useRace = (id: string) => {
  return useQuery({
    queryKey: raceQueries.detail(id),
    queryFn: () => fetchRace(id),
    enabled: !!id,
  })
}

export const useCreateRace = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createRace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: raceQueries.lists() })
    },
  })
}

export const useUpdateRace = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, race }: { id: string; race: Partial<Race> }) => updateRace(id, race),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: raceQueries.detail(id) })
      queryClient.invalidateQueries({ queryKey: raceQueries.lists() })
    },
  })
}

export const useDeleteRace = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteRace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: raceQueries.all() })
    },
  })
}

export const useRegisterForRace = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: registerForRace,
    onSuccess: (_, raceId) => {
      queryClient.invalidateQueries({ queryKey: raceQueries.detail(raceId) })
      queryClient.invalidateQueries({ queryKey: registrationQueries.all() })
    },
  })
}