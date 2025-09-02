import { Schema, model, models } from 'mongoose'
import { Registration } from '@/types'

const RegistrationSchema = new Schema<Registration>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  raceId: {
    type: Schema.Types.ObjectId,
    ref: 'Race',
    required: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  finishTime: {
    type: Number,
    min: 0,
    default: null
  },
  position: {
    type: Number,
    min: 1,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

RegistrationSchema.index({ userId: 1, raceId: 1 }, { unique: true })
RegistrationSchema.index({ raceId: 1, status: 1 })
RegistrationSchema.index({ userId: 1, status: 1 })

export const RegistrationModel = models.Registration || model<Registration>('Registration', RegistrationSchema)