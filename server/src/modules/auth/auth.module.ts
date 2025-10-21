import { Module } from '@nestjs/common';
import { GoogleStrategy } from './strategy/google.strategy';
import { AuthController } from './auth.controller';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthController],
  imports: [UserModule],
  providers: [GoogleStrategy, GoogleAuthGuard, AuthService],
})
export class AuthModule {}
