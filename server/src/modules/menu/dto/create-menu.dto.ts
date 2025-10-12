import { IsNotEmpty } from 'class-validator';

export class CreateMenuDto {
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public path: string;

  public pid: string;
}
