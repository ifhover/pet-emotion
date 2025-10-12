import { TaskStatus } from '@/common/type/dict';

export class Task {
  public id: string;
  public path: string;
  public status: TaskStatus;
  public error_message: string;
  public result: string | null;
  public created_at: Date;
  public updated_at: Date;
}
