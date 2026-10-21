import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/user'

export async function POST(req: Request) {
  await connectDB()
  const { email, password } = await req.json()
  const user = await User.findOne({ email, password })
  if (!user) return NextResponse.json({ error: 'Wrong credentials' }, { status: 401 })
  return NextResponse.json({ success: true, name: user.name })
}
