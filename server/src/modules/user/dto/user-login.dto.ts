import { IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  public account: string;

  @IsNotEmpty()
  public password: string;

  @IsNotEmpty()
  public turnstile_token: string;
}
