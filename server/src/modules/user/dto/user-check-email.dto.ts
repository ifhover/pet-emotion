import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserCheckEmailDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;
}
