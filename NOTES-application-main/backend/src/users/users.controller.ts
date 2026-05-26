import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto
  ) {
    return this.usersService.create(
      createUserDto
    );
  }

  @Post('login')
  async login(
    @Body()
    body: {
      email: string;
      password: string;
    }
  ) {

    try {

      const user =
        await this.usersService.validateUser(
          body.email,
          body.password
        );

      return {
        success: true,
        user
      };

    } catch {

      return {
        success: false,
        message: 'Invalid credentials'
      };

    }

  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('email/:email')
  findByEmail(
    @Param('email') email: string
  ) {
    return this.usersService.findByEmail(
      email
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.usersService.findOne(id);
  }

}