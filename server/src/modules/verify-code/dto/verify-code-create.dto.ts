import { VerifyCodeBizType, VerifyCodeChannel } from '@/common/type/dict';
import { IsNotEmpty } from 'class-validator';

export class VerifyCodeCreateDto {
  @IsNotEmpty()
  public bizType: VerifyCodeBizType;

  @IsNotEmpty()
  public receiver: string;

  @IsNotEmpty()
  public channel: VerifyCodeChannel = VerifyCodeChannel.邮箱;

  @IsNotEmpty()
  public turnstile_token: string;
}
