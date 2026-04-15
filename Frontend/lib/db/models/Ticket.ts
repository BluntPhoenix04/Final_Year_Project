import { Schema, Document, models, model } from 'mongoose'

export interface ITicket extends Document {
  subject: string
  category: string
  status: 'open' | 'in-progress' | 'resolved'
  priority: 'low' | 'medium' | 'high'
  submittedBy: string   // user email
  message: string
  createdAt: Date
}

const TicketSchema = new Schema<ITicket>(
  {
    subject:     { type: String, required: true },
    category:    { type: String, required: true },
    status:      { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
    priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    submittedBy: { type: String, required: true },
    message:     { type: String, default: '' },
  },
  { timestamps: true }
)

export const Ticket = models.Ticket || model<ITicket>('Ticket', TicketSchema)
