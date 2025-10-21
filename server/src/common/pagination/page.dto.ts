import { Transform, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PageDto {
  @IsNumber()
  @Type(() => Number)
  public page_index: number = 1;

  @IsNumber()
  @Type(() => Number)
  public page_size: number = 15;
}
