import mongoose, { Schema, Document, models, model } from 'mongoose'

// Timetable entry embedded in student users
export interface TimetableEntry {
  id: string
  code: string
  name: string
  instructor: string
  room: string
  building: string
  floor: number
  startTime: string
  endTime: string
  day: string
}

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'student' | 'faculty' | 'admin'
  timetable: TimetableEntry[]
  createdAt: Date
}

const TimetableEntrySchema = new Schema<TimetableEntry>({
  id: String,
  code: String,
  name: String,
  instructor: String,
  room: String,
  building: String,
  floor: Number,
  startTime: String,
  endTime: String,
  day: String,
}, { _id: false })

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
    timetable: { type: [TimetableEntrySchema], default: [] },
  },
  { timestamps: true }
)

export const User = models.User || model<IUser>('User', UserSchema)
