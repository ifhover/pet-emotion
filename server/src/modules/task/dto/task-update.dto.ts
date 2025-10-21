import { IsNumber } from 'class-validator';

export class TaskUpdateDto {
  @IsNumber()
  public grade?: number;
}
