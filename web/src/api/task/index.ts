import { request } from "@/utils/request";
import { Task } from "./type";

export const taskApi = {
  create: (data: FormData) => {
    return request.post<{ id: string }>("/task/create", data);
  },
  get: (id: string) => {
    return request.get<Task>(`/task/${id}`);
  },
  sse(id: string) {
    return new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/task/sse/${id}`);
  },
};
