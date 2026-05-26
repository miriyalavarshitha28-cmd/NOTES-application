import {
  Injectable,
  UnauthorizedException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './user.entity';

import { CreateUserDto } from './dto/create-user.dto';

import * as bcrypt from 'bcrypt';
import { SettingsService } from '../settings/settings.service';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly settingsService: SettingsService
  ) {}

  async create(createUserDto: CreateUserDto) {

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      10
    );

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword
    });

    const savedUser = await this.usersRepository.save(user);

    await this.settingsService.createForUser(
      savedUser.id
    );

    return this.toSafeUser(savedUser);
  }

  async findAll() {
    const users = await this.usersRepository.find();

    return users.map(user => this.toSafeUser(user));
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id }
    });

    return user ? this.toSafeUser(user) : null;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email }
    });

    return user ? this.toSafeUser(user) : null;
  }

  async update(
    id: string,
    updateUserDto: Partial<Omit<User, 'id' | 'password'>>
  ) {
    const allowedUpdates = Object.fromEntries(
      Object.entries({
        name: updateUserDto.name,
        email: updateUserDto.email
      }).filter(([, value]) => value !== undefined)
    );

    await this.usersRepository.update(
      id,
      allowedUpdates
    );

    return this.findOne(id);
  }

  async validateUser(
    email: string,
    password: string
  ) {

    const user =
      await this.usersRepository.findOne({
        where: { email }
      });

    if (!user) {
      throw new UnauthorizedException(
        'User not found'
      );
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid password'
      );
    }

    const { password: _, ...safeUser } = user;

    return safeUser;
  }

  private toSafeUser(user: User): SafeUser {
    const { password: _, ...safeUser } = user;

    return safeUser;
  }
}
