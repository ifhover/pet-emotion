import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { VerifyCodeService } from '../verify-code/verify-code.service';
import { TurnstileService } from '@/infrastructure/turnstile/turnstile.service';

@Module({
  controllers: [UserController],
  providers: [UserService, VerifyCodeService, TurnstileService],
  exports: [UserService],
})
export class UserModule {}
