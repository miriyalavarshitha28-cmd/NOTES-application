import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string }
  ) {
    const user = await this.usersService.findByEmail(body.email);

    if (!user || user.password !== body.password) {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }

    const { password, ...result } = user;

    return {
      success: true,
      user: result
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // MOVE THIS ABOVE :id
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}