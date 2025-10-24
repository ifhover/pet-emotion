import { FcGoogle } from "react-icons/fc";
import { Button } from "antd";
import { useAuthGoogleConfig } from "@/api/auth/hook";
import QueryString from "qs";

export default function GoogleLoginButton() {
  const { refetch, isLoading } = useAuthGoogleConfig({ enabled: false });

  async function handleClick() {
    const { data } = await refetch();
    if (!data) return;
    const query = QueryString.stringify({
      client_id: data.client_id,
      redirect_uri: data.redirect_uri,
      response_type: "code",
      scope: "email profile",
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${query}`;
  }

  return (
    <Button block size="large" color="default" variant="filled" loading={isLoading} onClick={handleClick}>
      <FcGoogle />
      使用谷歌账号
    </Button>
  );
}
