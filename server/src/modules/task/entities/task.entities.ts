import { TaskStatus } from '@/common/type/dict';

export type TaskEntities = {
  id: string;
  path: string;
  status: TaskStatus;
  error_message: string | null;
  result: string | null;
  created_at: Date;
  updated_at: Date;
};
