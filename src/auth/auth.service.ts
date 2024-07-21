import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from "argon2"
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService, private readonly configService: ConfigService) { }

  async signToken(userId: string, email: string) {
    return this.jwtService.signAsync({
      sub: userId,
      email,
    }, {
      expiresIn: "15m",
      secret: this.configService.get("JWT_SECRET"),
    })
  }

  async createUser(createAuthDto: CreateUserDto) {
    const { email, password } = createAuthDto

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email
      }
    })

    if (!!existingUser) {
      throw new HttpException(`User with email:${email} already exists`, 400)
    }

    const passwordHash = await argon.hash(password)

    const newUser = await this.prismaService.user.create({
      data: {
        email,
        passwordHash,
      }
    })

    const authToken = await this.signToken(newUser.id, newUser.email)

    return {
      authToken,
    }
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email
      }
    })

    if (!existingUser) {
      throw new HttpException(`User with email:${email} does not exist`, 400)
    }

    const isCorrectPassword = await argon.verify(existingUser.passwordHash, password)

    if (!isCorrectPassword) {
      throw new HttpException(`Incorrect password`, 400)
    }

    const authToken = await this.signToken(existingUser.id, existingUser.email)

    return {
      authToken,
    }
  }
}
