import { request } from "@/utils/request";
import { VerifyCodeCreateReq } from "./type";

export const verifyCodeApi = {
  create(data: VerifyCodeCreateReq) {
    return request.post<void>("/verify-code/create", data);
  },
};
