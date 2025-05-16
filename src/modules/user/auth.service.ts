import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { User } from '../models';
import { CreateUserDto, LoginDto, RegisterDto } from './dtos';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private jwtService: JwtService,
  ) {}
  async register(userData: RegisterDto) {
    await this.#verifyUniqueEmail(userData.email);
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await this.userRepository.create({
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
    });
    return {
      status: 'suces',
      details: {
        message: 'tokeni login qilgandan keyin olasiz',
        userInfo: newUser,
      },
    };
  }
  async login(credentials: LoginDto) {
    const user = await this.#findUserByEmail(credentials.email);

    if (!await bcrypt.compare(credentials.password, user.password)) {
      throw new ConflictException('Notogri parol');
    }
    const token = this.jwtService.sign({ userId: user.id, role: user.role });
    return {
        token
    };
  }
    async create(payload: CreateUserDto, image?: string) {
      const existing = await this.userRepository.findOne({ where: { email: payload.email } });
      if (existing) {
        throw new Error('email mavjud');
      }
      const passwordHash = bcrypt.hashSync(payload.password);
      const user = await this.userRepository.create({
        name: payload.name,
        email: payload.email,
        password: passwordHash,
        role: payload.role,
        image: image ?? null,
      });
      return {
        message: 'OK',
        data: user,
      };
    }
  

  async #verifyUniqueEmail(email: string) {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('email royxatan otgan');
    }
  }
  async #findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new ConflictException('toplmad');
    }
    return user;
  }
}