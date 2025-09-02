import { Schema, model, models } from 'mongoose'
import { Race } from '@/types'

const RaceSchema = new Schema<Race>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  image: {
    type: String,
    default: null
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  maxParticipants: {
    type: Number,
    min: 1,
    default: null
  },
  status: {
    type: String,
    enum: ['upcoming', 'registration_open', 'registration_closed', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

RaceSchema.index({ status: 1, startDate: 1 })
RaceSchema.index({ location: 1 })
RaceSchema.index({ createdBy: 1 })

RaceSchema.virtual('isRegistrationOpen').get(function() {
  const now = new Date()
  return this.status === 'registration_open' && 
         now <= this.registrationDeadline &&
         this.startDate > now
})

export const RaceModel = models.Race || model<Race>('Race', RaceSchema)