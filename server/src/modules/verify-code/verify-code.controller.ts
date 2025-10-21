import { Controller, Post, Body } from '@nestjs/common';
import { VerifyCodeService } from './verify-code.service';
import { VerifyCodeCreateDto } from './dto/verify-code-create.dto';
import { Public } from '@/common/decorator/public.decorator';

@Controller('verify-code')
export class VerifyCodeController {
  constructor(private readonly verifyCodeService: VerifyCodeService) {}

  @Post('create')
  @Public()
  public create(@Body() dto: VerifyCodeCreateDto) {
    return this.verifyCodeService.create(dto);
  }
}
