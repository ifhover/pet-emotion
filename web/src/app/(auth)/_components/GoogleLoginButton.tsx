import { FcGoogle } from "react-icons/fc";
import { Button } from "antd";

export default function GoogleLoginButton() {
  return (
    <Button
      block
      size="large"
      color="default"
      variant="filled"
      onClick={() => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
      }}
    >
      <FcGoogle />
      使用谷歌账号
    </Button>
  );
}
