import { VerifyCodeBizType, VerifyCodeChannel } from '@/common/type/dict';

export class VerifyCodeVerifyDto {
  public bizType: VerifyCodeBizType;

  public receiver: string;

  public code: string;

  public channel: VerifyCodeChannel = VerifyCodeChannel.邮箱;
}
