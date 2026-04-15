import { Schema, Document, models, model } from 'mongoose'

export interface IBooking extends Document {
  roomId: string
  roomName: string
  building: string
  floor: number
  date: string          // ISO date string e.g. "2026-04-15"
  startTime: string     // "09:00"
  endTime: string       // "11:00"
  purpose: string
  attendees: number
  userId: string        // email of the faculty who made the booking
  userName: string
  createdAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    roomId:    { type: String, required: true },
    roomName:  { type: String, required: true },
    building:  { type: String, required: true },
    floor:     { type: Number, required: true },
    date:      { type: String, required: true },
    startTime: { type: String, required: true },
    endTime:   { type: String, required: true },
    purpose:   { type: String, required: true },
    attendees: { type: Number, required: true },
    userId:    { type: String, required: true },
    userName:  { type: String, required: true },
  },
  { timestamps: true }
)

export const Booking = models.Booking || model<IBooking>('Booking', BookingSchema)
