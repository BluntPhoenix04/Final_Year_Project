/**
 * Seed script — run once with: npm run seed
 * Creates: 1 admin, 3 faculty, 3 students (each with unique timetable), 5 support tickets
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env.local')
  process.exit(1)
}

// ── Inline schemas to avoid TS module issues in raw node execution ──────────
const TimetableSchema = new mongoose.Schema({
  id: String, code: String, name: String, instructor: String,
  room: String, building: String, floor: Number, startTime: String, endTime: String, day: String,
}, { _id: false })

const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true, lowercase: true },
  password: String, role: String, timetable: [TimetableSchema],
}, { timestamps: true })

const BookingSchema = new mongoose.Schema({
  roomId: String, roomName: String, building: String, floor: Number,
  date: String, startTime: String, endTime: String, purpose: String,
  attendees: Number, userId: String, userName: String,
}, { timestamps: true })

const TicketSchema = new mongoose.Schema({
  subject: String, category: String,
  status: { type: String, default: 'open' },
  priority: { type: String, default: 'medium' },
  submittedBy: String, message: String,
}, { timestamps: true })

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to MongoDB')

  const User    = mongoose.models.User    || mongoose.model('User',    UserSchema)
  const Ticket  = mongoose.models.Ticket  || mongoose.model('Ticket',  TicketSchema)
  const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema)

  // ── Clear existing seed data ────────────────────────────────────────────
  await User.deleteMany({})
  await Ticket.deleteMany({})
  await Booking.deleteMany({})
  console.log('🗑  Cleared existing data')

  const hash = (pw: string) => bcrypt.hash(pw, 12)

  // ── Users ────────────────────────────────────────────────────────────────
  const users = [
    // ADMIN
    {
      name: 'Campus Admin',
      email: 'admin@univ.edu.in',
      password: await hash('Admin@123'),
      role: 'admin',
      timetable: [],
    },
    // FACULTY
    {
      name: 'Dr. Alan Smith',
      email: 'dr.smith@univ.edu.in',
      password: await hash('Faculty@123'),
      role: 'faculty',
      timetable: [],
    },
    {
      name: 'Prof. Sarah Johnson',
      email: 'prof.johnson@univ.edu.in',
      password: await hash('Faculty@123'),
      role: 'faculty',
      timetable: [],
    },
    {
      name: 'Dr. Emily Williams',
      email: 'dr.williams@univ.edu.in',
      password: await hash('Faculty@123'),
      role: 'faculty',
      timetable: [],
    },
    // STUDENT 1 — CS Track
    {
      name: 'Alice Sharma',
      email: 'alice@univ.edu.in',
      password: await hash('Student@123'),
      role: 'student',
      timetable: [
        { id: 'a-1', code: 'CS101', name: 'Intro to Computer Science', instructor: 'Dr. Alan Smith', room: '101', building: 'CS Block', floor: 1, startTime: '09:00', endTime: '10:30', day: 'Monday' },
        { id: 'a-2', code: 'MATH201', name: 'Calculus II', instructor: 'Prof. Sarah Johnson', room: '204', building: 'Main Block', floor: 2, startTime: '11:00', endTime: '12:30', day: 'Monday' },
        { id: 'a-3', code: 'CS301', name: 'Data Structures', instructor: 'Dr. Alan Smith', room: '305', building: 'CS Block', floor: 3, startTime: '09:00', endTime: '10:30', day: 'Wednesday' },
        { id: 'a-4', code: 'CS405', name: 'Advanced AI Research', instructor: 'Dr. Alan Smith', room: '409', building: 'CS Block', floor: 4, startTime: '10:00', endTime: '12:00', day: 'Thursday' },
        { id: 'a-5', code: 'MATH301', name: 'Linear Algebra', instructor: 'Prof. Sarah Johnson', room: '202', building: 'Main Block', floor: 2, startTime: '14:00', endTime: '15:30', day: 'Friday' },
      ],
    },
    // STUDENT 2 — Science Track
    {
      name: 'Bob Mehta',
      email: 'bob@univ.edu.in',
      password: await hash('Student@123'),
      role: 'student',
      timetable: [
        { id: 'b-1', code: 'PHYS101', name: 'Physics I', instructor: 'Prof. Sarah Johnson', room: '201', building: 'Science Hall', floor: 2, startTime: '10:00', endTime: '11:30', day: 'Monday' },
        { id: 'b-2', code: 'CHEM201', name: 'Organic Chemistry', instructor: 'Dr. Emily Williams', room: '303', building: 'Science Hall', floor: 3, startTime: '13:00', endTime: '14:30', day: 'Tuesday' },
        { id: 'b-3', code: 'PHYS301', name: 'Modern Physics Lab', instructor: 'Prof. Sarah Johnson', room: '301', building: 'Science Hall', floor: 3, startTime: '11:00', endTime: '13:00', day: 'Wednesday' },
        { id: 'b-4', code: 'BIO102', name: 'Cell Biology', instructor: 'Dr. Emily Williams', room: '105', building: 'Science Hall', floor: 1, startTime: '09:00', endTime: '10:30', day: 'Thursday' },
        { id: 'b-5', code: 'ENV201', name: 'Environmental Science', instructor: 'Dr. Emily Williams', room: '210', building: 'Science Hall', floor: 2, startTime: '14:00', endTime: '15:30', day: 'Friday' },
      ],
    },
    // STUDENT 3 — Mixed / Arts Track
    {
      name: 'Charlie Patel',
      email: 'charlie@univ.edu.in',
      password: await hash('Student@123'),
      role: 'student',
      timetable: [
        { id: 'c-1', code: 'ENG102', name: 'Literature & Composition', instructor: 'Dr. Emily Williams', room: '309', building: 'Arts Center', floor: 3, startTime: '14:00', endTime: '15:30', day: 'Tuesday' },
        { id: 'c-2', code: 'HIST201', name: 'Modern World History', instructor: 'Dr. Emily Williams', room: '210', building: 'Arts Center', floor: 2, startTime: '09:00', endTime: '10:30', day: 'Wednesday' },
        { id: 'c-3', code: 'PSYC101', name: 'Introduction to Psychology', instructor: 'Prof. Sarah Johnson', room: '101', building: 'Arts Center', floor: 1, startTime: '11:00', endTime: '12:30', day: 'Monday' },
        { id: 'c-4', code: 'ECON301', name: 'Microeconomics', instructor: 'Prof. Sarah Johnson', room: '308', building: 'Main Block', floor: 3, startTime: '13:00', endTime: '14:30', day: 'Thursday' },
        { id: 'c-5', code: 'ART201', name: 'Digital Arts & Design', instructor: 'Dr. Emily Williams', room: '401', building: 'Arts Center', floor: 4, startTime: '10:00', endTime: '12:00', day: 'Friday' },
      ],
    },
  ]

  await User.insertMany(users)
  console.log(`✅ Seeded ${users.length} users`)

  // ── Support Tickets ──────────────────────────────────────────────────────
  const tickets = [
    { subject: 'Projector broken in Room 301', category: 'Technical Support', status: 'open', priority: 'high', submittedBy: 'alice@univ.edu.in', message: 'The projector in Room 301 Science Hall stopped working mid-lecture.' },
    { subject: 'AC not working in Seminar Hall', category: 'Facilities', status: 'in-progress', priority: 'medium', submittedBy: 'dr.smith@univ.edu.in', message: 'Air conditioning has been off for two days in Arts Center seminar hall.' },
    { subject: 'Navigation map shows wrong floor for Library', category: 'Navigation Help', status: 'open', priority: 'low', submittedBy: 'bob@univ.edu.in', message: 'When I search for the library it displays Floor 1 but it is on Floor 2.' },
    { subject: 'Cannot complete room booking for Research Lab', category: 'Room Booking', status: 'resolved', priority: 'medium', submittedBy: 'prof.johnson@univ.edu.in', message: 'Booking form submitted but no confirmation received.' },
    { subject: 'Wi-Fi dropping in Library study area', category: 'Technical Support', status: 'open', priority: 'high', submittedBy: 'charlie@univ.edu.in', message: 'Internet cuts out every 10-15 minutes on Floor 2 of the Library.' },
  ]

  await Ticket.insertMany(tickets)
  console.log(`✅ Seeded ${tickets.length} support tickets`)

  console.log('\n📋 Pre-seeded Login Credentials:')
  console.log('─────────────────────────────────────────')
  console.log('ADMIN:    admin@univ.edu.in     / Admin@123')
  console.log('FACULTY:  dr.smith@univ.edu.in  / Faculty@123')
  console.log('FACULTY:  prof.johnson@univ.edu.in / Faculty@123')
  console.log('FACULTY:  dr.williams@univ.edu.in  / Faculty@123')
  console.log('STUDENT:  alice@univ.edu.in     / Student@123  (CS Track)')
  console.log('STUDENT:  bob@univ.edu.in       / Student@123  (Science Track)')
  console.log('STUDENT:  charlie@univ.edu.in   / Student@123  (Arts Track)')
  console.log('─────────────────────────────────────────')

  await mongoose.disconnect()
  console.log('✅ Seed complete. Disconnected.')
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
