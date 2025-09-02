import { ObjectId } from 'mongodb'

export interface User {
  _id: ObjectId
  name: string
  email: string
  password?: string
  image?: string
  bio?: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}

export interface Race {
  _id: ObjectId
  name: string
  description: string
  image?: string
  location: string
  startDate: Date
  endDate: Date
  registrationDeadline: Date
  maxParticipants?: number
  status: 'upcoming' | 'registration_open' | 'registration_closed' | 'ongoing' | 'completed'
  createdBy: ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface Registration {
  _id: ObjectId
  userId: ObjectId
  raceId: ObjectId
  registeredAt: Date
  status: 'pending' | 'approved' | 'rejected'
  finishTime?: number
  position?: number
}

export interface RaceFilters {
  status?: Race['status']
  location?: string
  startDate?: string
  endDate?: string
}

export interface RaceWithRegistrations extends Race {
  registrationCount: number
  userRegistration?: Registration
}

export interface UserStats {
  totalRaces: number
  completedRaces: number
  avgPosition?: number
  bestTime?: number
}

export interface ContactMessage {
  _id: ObjectId
  name: string
  email: string
  subject?: string | null
  message: string
  userId?: ObjectId | null
  createdAt: Date
  updatedAt: Date
}