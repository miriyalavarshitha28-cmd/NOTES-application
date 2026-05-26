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

    return savedUser;
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: string) {
    return this.usersRepository.findOne({
      where: { id }
    });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email }
    });
  }

  async update(
    id: string,
    updateUserDto: Partial<Omit<User, 'id' | 'password'>>
  ) {
    const allowedUpdates = Object.fromEntries(
      Object.entries({
        name: updateUserDto.name,
        email: updateUserDto.email,
        username: updateUserDto.username,
        plan: updateUserDto.plan,
        joined: updateUserDto.joined,
        favoriteColor: updateUserDto.favoriteColor
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
}
