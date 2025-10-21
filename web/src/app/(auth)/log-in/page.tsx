"use client";

import { Alert, Button, Divider, Form, Input, Spin } from "antd";
import { useUserLogin } from "@/api/user/hook";
import TurnstileInput, { useTurnstileRef } from "@/components/TurnstileInput";
import { useEffect } from "react";
import jsCookie from "js-cookie";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { UserLoginReq } from "@/api/user/type";
import Link from "next/link";
import GoogleLoginButton from "../_components/GoogleLoginButton";

export default function LoginPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const turnstileRef = useTurnstileRef();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("token")) {
      jsCookie.set("token", searchParams.get("token") as string, {
        expires: dayjs().add(7, "day").toDate(),
      });
      router.push("/");
    }
  }, [searchParams]);

  const { mutateAsync: loginAsync, isPending: loadingLogin, error } = useUserLogin();

  useEffect(() => {
    if (error) {
      turnstileRef.current?.reset();
    }
  }, [error]);

  async function handleLogin(values: UserLoginReq) {
    const token = await loginAsync(values);
    jsCookie.set("token", token, {
      expires: dayjs().add(7, "day").toDate(),
    });
    router.push("/");
  }
  return (
    <div className="w-full max-w-xs mt-10">
      <Spin spinning={searchParams.get("token") !== null} size="large">
        {searchParams.get("success") && (
          <Alert message={searchParams.get("success")} type="success" className="mb-4 w-full" showIcon />
        )}
        <div className="text-2xl font-bold mb-4">欢迎回来</div>
        <div className="text-sm text-gray-500 mb-7">欢迎回来，请输入您的账户信息继续使用服务</div>
        <div className="w-full">
          <Form size="large" layout="vertical" form={form} onFinish={handleLogin}>
            <Form.Item
              name="account"
              label={
                <div className="flex">
                  邮箱
                  <div></div>
                </div>
              }
              rules={[
                {
                  type: "email",
                  required: true,
                },
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
            <Form.Item name="turnstile_token" rules={[{ required: true, message: "请先完成校验" }]}>
              <TurnstileInput />
            </Form.Item>
          </Form>
          <Button size="large" type="primary" block onClick={() => form.submit()} loading={loadingLogin}>
            登录
          </Button>
          <div className="text-sm text-gray-500 mt-4 text-center">
            没有账号? <Link href="/sign-up">注册</Link>
          </div>
          <Divider plain className="mt-6">
            或者
          </Divider>
          <div>
            <GoogleLoginButton />
          </div>
        </div>
      </Spin>
    </div>
  );
}
