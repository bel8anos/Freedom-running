import { Schema, model, models } from 'mongoose'
import { ContactMessage } from '@/types'

const ContactSchema = new Schema<ContactMessage>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  subject: {
    type: String,
    trim: true,
    maxlength: 150,
    default: null,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

ContactSchema.index({ email: 1, createdAt: -1 })

export const ContactModel = models.Contact || model<ContactMessage>('Contact', ContactSchema)




