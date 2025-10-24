import { authApi } from ".";
import { useQuery } from "@tanstack/react-query";

export function useAuthGoogleConfig({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["auth_google_config"],
    queryFn: () => authApi.googleConfig(),
    enabled,
  });
}
