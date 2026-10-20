import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function POST(req: Request) {
  const { name, email, password } = await req.json()
  await connectDB()
  const exists = await User.findOne({ email })
  if (exists) return Response.json({ error: 'User exists' }, { status: 400 })
  await User.create({ name, email, password }) // later we hash
  return Response.json({ success: true })
}
