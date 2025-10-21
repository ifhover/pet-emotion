import { request } from "@/utils/request";
import { Task, TaskListReq, TaskUpdateReq } from "./type";
import { PageData, PageRequest } from "@/type/common";

export const taskApi = {
  create: (data: FormData) => {
    return request.post<{ id: string }>("/task/create", data);
  },
  get: (id: string) => {
    return request.get<Task>(`/task/info/${id}`);
  },
  sse(id: string) {
    return new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/task/sse/${id}`);
  },
  genLimit() {
    return request.get<number>("/task/gen-limit");
  },
  myRecords() {
    return request.get<Task[]>("/task/my-records");
  },
  list(data: PageRequest<TaskListReq>) {
    return request.get<PageData<Task>>("/task", data);
  },
  update(data: TaskUpdateReq) {
    return request.post(`/task/update/${data.id}`, data);
  },
};
