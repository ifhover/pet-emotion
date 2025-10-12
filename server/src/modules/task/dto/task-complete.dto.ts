import { TaskStatus } from '@/common/type/dict';

export type TaskCompleteDto = {
  id: string;
} & (
  | {
      status: TaskStatus.Ok;
      result: string;
    }
  | {
      status: TaskStatus.Error;
      error_message: string;
    }
);
