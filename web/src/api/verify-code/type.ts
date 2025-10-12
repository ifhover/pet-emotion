import { VerifyCodeBizType, VerifyCodeChannel } from "@/type/common";

export type VerifyCodeCreateReq = {
  bizType: VerifyCodeBizType;
  channel: VerifyCodeChannel;
  receiver: string;
  turnstile_token: string;
};
