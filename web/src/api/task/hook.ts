import { taskApi } from "@/api/task";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useTaskCreate() {
  return useMutation({
    mutationFn: taskApi.create,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ["task_get", id],
    queryFn: () => {
      return taskApi.get(id);
    },
  });
}
