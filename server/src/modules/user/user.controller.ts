import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { FromUser } from '@/common/decorator/user.decorator';
import { User } from './entities/user.entities';
import { UserCheckEmailDto } from './dto/user-check-email.dto';
import { Public } from '@/common/decorator/public.decoratot';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @Public()
  public login(@Body() dto: UserLoginDto) {
    return this.userService.login(dto);
  }

  @Post('register')
  @Public()
  public register(@Body() dto: UserRegisterDto) {
    return this.userService.register(dto);
  }

  @Post('check-email')
  @Public()
  public checkEmail(@Body() dto: UserCheckEmailDto) {
    return this.userService.checkEmail(dto);
  }

  @Get('my-detail')
  public myDetail(@FromUser() user: User) {
    return user;
  }
}
