import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

import { connectDB } from '@/lib/db/mongoose'
import { Booking } from '@/lib/db/models/Booking'
import { getUserFromHeader } from '@/lib/auth'

// GET — fetch bookings
// Admin gets all; faculty gets all (to check conflicts); student gets none
export async function GET(req: NextRequest) {
  const user = getUserFromHeader(req.headers.get('authorization'))
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()

  let bookings
  if (user.role === 'admin' || user.role === 'faculty') {
    bookings = await Booking.find().sort({ createdAt: -1 }).lean()
  } else {
    bookings = []
  }

  return NextResponse.json({ bookings })
}

// POST — create booking (faculty only) with conflict detection
export async function POST(req: NextRequest) {
  const user = getUserFromHeader(req.headers.get('authorization'))
  if (!user || user.role === 'student' || user.role === 'admin') {
    return NextResponse.json({ error: 'Only faculty can make bookings' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { roomId, roomName, building, floor, date, startTime, endTime, purpose, attendees } = body

    if (!roomId || !date || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    // Conflict detection: check if this room is already booked at overlapping time on same date
    const conflict = await Booking.findOne({
      roomId,
      date,
      $or: [
        // new booking starts inside existing booking
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    })

    if (conflict) {
      return NextResponse.json(
        {
          error: `Room conflict: "${roomName}" is already booked from ${conflict.startTime} to ${conflict.endTime} on ${conflict.date} by ${conflict.userName}.`,
          conflict: true,
        },
        { status: 409 }
      )
    }

    const booking = await Booking.create({
      roomId, roomName, building, floor, date, startTime, endTime, purpose, attendees,
      userId: user.email,
      userName: user.name,
    })

    return NextResponse.json({ booking }, { status: 201 })
  } catch (err) {
    console.error('[BOOKING POST ERROR]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — cancel a booking (admin or the booking owner)
export async function DELETE(req: NextRequest) {
  const user = getUserFromHeader(req.headers.get('authorization'))
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })

  await connectDB()
  const booking = await Booking.findById(id)
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

  if (user.role !== 'admin' && booking.userId !== user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await booking.deleteOne()
  return NextResponse.json({ success: true })
}
