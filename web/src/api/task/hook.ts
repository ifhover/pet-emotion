import { taskApi } from "@/api/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskListReq } from "./type";
import { PageRequest } from "@/type/common";

export function useTaskCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task_my_records"] });
    },
  });
}

export function useTask(id?: string) {
  return useQuery({
    queryKey: ["task_get", id],
    enabled: !!id,
    queryFn: () => {
      return taskApi.get(id!);
    },
  });
}

export function useTaskGenLimit() {
  return useQuery({
    queryKey: ["task_gen_limit"],
    staleTime: 5 * 60 * 1000,
    queryFn: () => {
      return taskApi.genLimit();
    },
  });
}

export function useTaskMyRecords() {
  return useQuery({
    queryKey: ["task_my_records"],
    queryFn: () => {
      return taskApi.myRecords();
    },
  });
}

export function useTaskList(data: PageRequest<TaskListReq>) {
  return useQuery({
    queryKey: ["task_list", data],
    queryFn: () => {
      return taskApi.list(data);
    },
  });
}

export function useTaskUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task_list"] });
    },
  });
}

export function useTaskIndexCases() {
  return useQuery({
    queryKey: ["task_index_cases"],
    queryFn: () => {
      return taskApi.indexCases();
    },
  });
}
