import { userApi } from "@/api/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserLoginReq } from "@/api/user/type";

export function useUserLogin() {
  return useMutation({
    mutationFn: (arg: UserLoginReq) => {
      return userApi.login(arg);
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
