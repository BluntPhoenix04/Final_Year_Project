import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db/mongoose'
import { User } from '@/lib/db/models/User'
import { signToken } from '@/lib/auth'

const ALLOWED_DOMAIN = '@univ.edu.in'

export async function POST(req: NextRequest) {
  try {
    const { email, password, role: requestedRole } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Domain validation
    if (!email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
      return NextResponse.json({ error: `Only ${ALLOWED_DOMAIN} email addresses are allowed` }, { status: 403 })
    }

    await connectDB()
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Validate that the selected role button matches the actual DB role
    if (requestedRole && user.role !== requestedRole) {
      return NextResponse.json(
        { error: `This account is not registered as ${requestedRole}. Please select the correct role.` },
        { status: 403 }
      )
    }

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
        timetable: user.timetable || [],
      },
    })
  } catch (err) {
    console.error('[LOGIN ERROR]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
