import { connectDB } from '@/lib/db'
import User from '@/models/User'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  await connectDB()
  const user = await User.findOne({ email, password })
  if (!user) return Response.json({ error: 'Wrong' }, { status: 401 })
  return Response.json({ success: true, name: user.name })
}
