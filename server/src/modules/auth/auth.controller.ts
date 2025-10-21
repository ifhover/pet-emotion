import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { GoogleProfileEntities } from './entities/google-profile.entities';
import { Public } from '@/common/decorator/public.decorator';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @Public()
  public google() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @Public()
  @Redirect()
  public async googleCallback(@Req() req: Request & { user: GoogleProfileEntities }) {
    const token = await this.authService.googleLogin(req.user);
    return {
      url: `${this.configService.get<string>('FRONTEND_URL')}/log-in?token=${token}`,
      statusCode: 302,
    };
  }
}
