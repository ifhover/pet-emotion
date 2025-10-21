import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserCheckEmailDto } from './dto/user-check-email.dto';
import { Public } from '@/common/decorator/public.decorator';

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
  @Public()
  public async myDetail(@Req() req: Request) {
    const token = this.userService.extractTokenFromHeader(req);
    if (token) {
      return await this.userService.myDetail(token);
    }
    return null;
  }
}
