import { request } from "@/utils/request";
import { AuthGoogleConfig } from "./type";

export const authApi = {
  googleConfig() {
    return request.get<AuthGoogleConfig>("/auth/google/config");
  },
};
