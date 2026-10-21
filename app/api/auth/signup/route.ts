import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/user'

export async function POST(req: Request) {
  await connectDB()
  const { name, email, password } = await req.json()
  const exists = await User.findOne({ email })
  if (exists) return NextResponse.json({ error: 'User exists' }, { status: 400 })
  const user = await User.create({ name, email, password })
  return NextResponse.json({ success: true, name: user.name })
}
