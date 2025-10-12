import { Module } from '@nestjs/common';
import { VerifyCodeService } from './verify-code.service';
import { TurnstileService } from '@/infrastructure/turnstile/turnstile.service';

@Module({
  providers: [VerifyCodeService, TurnstileService],
})
export class VerifyCodeModule {}
