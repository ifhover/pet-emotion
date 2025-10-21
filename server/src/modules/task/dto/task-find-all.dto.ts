import { TaskStatus } from '@/common/type/dict';
import { PageDto } from '@/common/pagination/page.dto';

export class TaskFindAllDto extends PageDto {
  public status?: TaskStatus;

  public grade?: number;
}
