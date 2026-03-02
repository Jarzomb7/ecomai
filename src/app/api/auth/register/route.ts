// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  companyName: z.string().optional(),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = registerSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { name, email, password, companyName } = parsed.data

  const existingUser = await db.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: 'Użytkownik z tym emailem już istnieje' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await db.user.create({
    data: { name, email, password: hashedPassword, companyName },
    select: { id: true, name: true, email: true },
  })

  // Create default platforms for new user
  await db.platform.createMany({
    data: [
      { userId: user.id, name: 'Allegro', type: 'ALLEGRO', commissionRate: 8.5 },
      { userId: user.id, name: 'Amazon PL', type: 'AMAZON', commissionRate: 15 },
      { userId: user.id, name: 'OLX', type: 'OLX', commissionRate: 5 },
      { userId: user.id, name: 'Sklep własny', type: 'WOOCOMMERCE', commissionRate: 0 },
    ],
  })

  return NextResponse.json(user, { status: 201 })
}
