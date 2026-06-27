import bcrypt from 'bcrypt'
import { prisma } from '../../database/prisma.js'
import { logger } from '../../utils/logger.js'

const DEMO_USERS = [
  {
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'Admin',
  },
  {
    email: 'staff@demo.com',
    password: 'staff123',
    role: 'Staff',
  },
] as const

export async function seedDemoUsers() {
  for (const demoUser of DEMO_USERS) {
    const existingUser = await prisma.user.findUnique({
      where: { email: demoUser.email },
    })

    if (existingUser) {
      continue
    }

    const passwordHash = await bcrypt.hash(demoUser.password, 12)

    await prisma.user.create({
      data: {
        email: demoUser.email,
        passwordHash,
        role: demoUser.role,
      },
    })
  }

  logger.info('Demo users are ready')
}
