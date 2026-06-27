import bcrypt from 'bcrypt'
import { HTTP_STATUS } from '../../constants/httpStatus.js'
import { AppError } from '../../errors/AppError.js'
import { AuthRepository } from './auth.repository.js'
import type { LoginInput, LoginResult } from './auth.types.js'

export class AuthService {
  constructor(private readonly authRepository = new AuthRepository()) {}

  getModuleStatus() {
    void this.authRepository
    return { module: 'auth', status: 'ready' }
  }

  async login(input: LoginInput): Promise<LoginResult> {
    const email = input.email.trim().toLowerCase()
    const user = await this.authRepository.findUserByEmail(email)

    if (!user) {
      throw new AppError('Invalid demo account credentials', HTTP_STATUS.UNAUTHORIZED)
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash)

    if (!isPasswordValid) {
      throw new AppError('Invalid demo account credentials', HTTP_STATUS.UNAUTHORIZED)
    }

    return {
      user: {
        email: user.email,
        id: user.id,
        role: user.role,
      },
    }
  }
}
