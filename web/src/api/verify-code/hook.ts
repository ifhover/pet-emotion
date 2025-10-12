import { useMutation } from "@tanstack/react-query";
import { verifyCodeApi } from ".";

export function useVerifyCodeCreate() {
  return useMutation({
    mutationFn: verifyCodeApi.create,
  });
}
