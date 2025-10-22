import { userApi } from "@/api/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserLoginReq } from "@/api/user/type";

export function useUserLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (arg: UserLoginReq) => {
      return userApi.login(arg);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task_gen_limit"] });
    },
  });
}

export function useUserCheckEmail() {
  return useMutation({
    mutationFn: userApi.check_email,
  });
}

export function useUserRegister() {
  return useMutation({
    mutationFn: userApi.register,
  });
}

export function useUserMyDetail() {
  return useQuery({
    queryKey: ["user_my_detail"],
    queryFn: () => {
      return userApi.my_detail();
    },
  });
}
