import { Module } from '@nestjs/common';
import { VerifyCodeService } from './verify-code.service';
import { TurnstileService } from '@/infrastructure/turnstile/turnstile.service';
import { VerifyCodeController } from './verify-code.controller';

@Module({
  controllers: [VerifyCodeController],
  providers: [VerifyCodeService, TurnstileService],
})
export class VerifyCodeModule {}
