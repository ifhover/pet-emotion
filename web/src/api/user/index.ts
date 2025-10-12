import { request } from "@/utils/request";
import { User, UserCheckEmailReq, UserLoginReq, UserRegisterReq, UserSendEmailCodeReq } from "./type";

export const userApi = {
  login: (data: UserLoginReq) => {
    return request.post<string>("/user/login", data);
  },
  check_email: (data: UserCheckEmailReq) => {
    return request.post<boolean>("/user/register/check-email", data);
  },
  register: (data: UserRegisterReq) => {
    return request.post<void>("/user/register", data);
  },
  my_detail: () => {
    return request.get<User>("/user/my-detail");
  },
};
