export type User = {
  id: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
};

export type UserLoginReq = {
  account: string;
  password: string;
  turnstile_token: string;
};

export type UserCheckEmailReq = {
  email: string;
};

export type UserSendEmailCodeReq = {
  email: string;
  turnstile_token: string;
};

export type UserRegisterReq = {
  email: string;
  password: string;
  email_verify_code: string;
};
