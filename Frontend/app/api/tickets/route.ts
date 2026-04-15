import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { connectDB } from '@/lib/db/mongoose'
import { Ticket } from '@/lib/db/models/Ticket'
import { getUserFromHeader } from '@/lib/auth'

// GET — admin sees all, others see own tickets
export async function GET(req: NextRequest) {
  const user = getUserFromHeader(req.headers.get('authorization'))
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()

  const tickets = user.role === 'admin'
    ? await Ticket.find().sort({ createdAt: -1 }).lean()
    : await Ticket.find({ submittedBy: user.email }).sort({ createdAt: -1 }).lean()

  return NextResponse.json({ tickets })
}

// POST — any logged-in user can submit a ticket
export async function POST(req: NextRequest) {
  const user = getUserFromHeader(req.headers.get('authorization'))
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { subject, category, priority, message } = await req.json()
    if (!subject || !category) {
      return NextResponse.json({ error: 'Subject and category are required' }, { status: 400 })
    }

    await connectDB()
    const ticket = await Ticket.create({
      subject, category, priority: priority || 'medium',
      message: message || '',
      submittedBy: user.email,
      status: 'open',
    })

    return NextResponse.json({ ticket }, { status: 201 })
  } catch (err) {
    console.error('[TICKET POST ERROR]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT — admin updates ticket status
export async function PUT(req: NextRequest) {
  const user = getUserFromHeader(req.headers.get('authorization'))
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  try {
    const { id, status } = await req.json()
    if (!id || !status) return NextResponse.json({ error: 'ID and status required' }, { status: 400 })

    await connectDB()
    const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true })
    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })

    return NextResponse.json({ ticket })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — admin only
export async function DELETE(req: NextRequest) {
  const user = getUserFromHeader(req.headers.get('authorization'))
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  await connectDB()
  await Ticket.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
