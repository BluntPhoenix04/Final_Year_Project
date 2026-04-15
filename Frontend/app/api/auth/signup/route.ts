import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/db/models/User'
import { signToken } from '@/lib/auth'

const ALLOWED_DOMAIN = '@univ.edu.in'
// Admins can only be pre-seeded, no self-registration allowed
const ADMIN_EMAIL = 'admin@univ.edu.in'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Domain validation
    if (!email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
      return NextResponse.json({ error: `Only ${ALLOWED_DOMAIN} email addresses are allowed` }, { status: 403 })
    }

    // Block self-registration as admin
    if (role === 'admin' || email.toLowerCase() === ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Admin accounts cannot be self-registered' }, { status: 403 })
    }

    await connectDB()

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      timetable: [], // new users start with empty timetable
    })

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    })

    return NextResponse.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 })
  } catch (err) {
    console.error('[SIGNUP ERROR]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
