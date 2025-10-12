"use client";

import { Alert, App, Button, Checkbox, Form, Input } from "antd";
import { useEffect, useState } from "react";
import jsCookie from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { useUserLogin } from "@/api/user/hook";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import TurnstileInput, { useTurnstileRef } from "@/components/TurnstileInput";
import { UserLoginReq } from "@/api/user/type";

export default function Login() {
  // 是否需要校验
  const [needCheck, setNeedCheck] = useState<boolean>(false);
  const { message } = App.useApp();
  const query = useSearchParams();

  const router = useRouter();

  // 创建表单实例
  const [form] = Form.useForm<UserLoginReq>();

  const turnstileRef = useTurnstileRef();

  const { mutateAsync: loginAsync, isPending: loadingLogin, error } = useUserLogin();

  useEffect(() => {
    if (error) {
      turnstileRef.current?.reset();
    }
  }, [error]);

  async function handleLogin(value: UserLoginReq) {
    const token = await loginAsync(value);
    message.success("登录成功"); // 登录成功提示
    jsCookie.set("token", token, {
      expires: dayjs().add(1, "day").toDate(),
    });
    router.push("/panel");
  }

  // 表单提交时的处理函数
  const onFinish = async (values: UserLoginReq) => {
    handleLogin(values); // 如果检查通过，触发登录
  };

  return (
    <div>
      {query.get("message") && (
        <Alert
          message={query.get("message")}
          type="error"
          className="mb-3"
          showIcon
          icon={<ExclamationCircleOutlined className="text-red-500" />}
        />
      )}
      <h1 className="text-3xl font-bold mb-2">Welcome back👋</h1>
      <p className="text-sm text-gray-500 mb-7">请输入您的登录信息</p>
      {/* 登录表单 */}
      <Form layout="vertical" size="large" onFinish={onFinish} form={form}>
        <Form.Item hidden name="captcha_id">
          <Input />
        </Form.Item>
        <Form.Item hidden name="captcha_value">
          <Input />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="account"
          rules={[
            { required: true, message: "请输入邮箱" },
            { type: "email", message: "请输入正确格式的邮箱" },
          ]}
        >
          <Input
            onBlur={(e) => (e.target.value ? setNeedCheck(true) : null)}
            autoFocus
            placeholder="请输入邮箱"
          />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        {needCheck && (
          <Form.Item name="turnstile_token" rules={[{ required: true, message: "请先完成校验" }]}>
            <TurnstileInput ref={turnstileRef} />
          </Form.Item>
        )}
        <div className="flex justify-between items-center mb-6">
          <Checkbox>记住我</Checkbox>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loadingLogin}>
            登录
          </Button>
        </Form.Item>
      </Form>
      <div className="flex justify-center items-center mt-5 text-sm">
        <div>
          没有账号？
          <Link href="./register" prefetch className="text-primary-500">
            点击注册
          </Link>
        </div>
      </div>
    </div>
  );
}
