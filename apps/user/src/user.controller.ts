import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from '@app/redis';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Inject(RedisService)
  redisService: RedisService;
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    delete registerUser.captcha;
    return await this.userService.create(registerUser);
  }

  @Get()
  async getHello() {
    const keys = await this.redisService.keys('*');
    return this.userService.getHello() + keys;
  }
}
