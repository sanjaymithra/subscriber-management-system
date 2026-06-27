import { prisma } from '../../database/prisma.js'

export class AuthRepository {
  findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  }
}
