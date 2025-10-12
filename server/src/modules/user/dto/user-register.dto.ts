import { IsNotEmpty } from 'class-validator';

export class UserRegisterDto {
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public password: string;

  @IsNotEmpty()
  public email_verify_code: string;
}
