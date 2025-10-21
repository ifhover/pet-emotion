export enum TaskStatus {
  Ok = "ok",
  Error = "error",
  Processing = "processing",
}

export type Task = {
  id: string;
  path: string;
  status: TaskStatus;
  error_message: string;
  result: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskResult = {
  pets: Array<{
    bbox_2d: number[];
    position_desc: string;
    breed: string;
    tags: string[];
    emotion_condition: string;
    emotion: {
      score: 0;
      level: string;
      desc: string;
      confidence: 0;
      emoji: string;
    };
    BCS: {
      score: 0;
      level: string;
      desc: string;
      confidence: 0;
      emoji: string;
    };
    comfort: {
      score: 0;
      level: string;
      desc: string;
      confidence: 0;
      emoji: string;
    };
    health: {
      body_condition: string;
      coat_condition: string;
      concerns: string;
      score: number;
    };
    summary: string;
  }>;
};

export type TaskListReq = {
  status?: TaskStatus;
  grade?: number;
};

export type TaskUpdateReq = {
  id: string;
  grade?: number;
};
