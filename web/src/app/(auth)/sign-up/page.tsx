"use client";

import { Alert, App, Divider } from "antd";
import { Button, Form, Input } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import TurnstileInput from "@/components/TurnstileInput";
import { useVerifyCodeCreate } from "@/api/verify-code/hook";
import { VerifyCodeBizType, VerifyCodeChannel } from "@/type/common";
import { useTurnstileRef } from "@/components/TurnstileInput";
import { useUserRegister } from "@/api/user/hook";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "../_components/GoogleLoginButton";

export default function SignUp() {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const turnstileRef = useTurnstileRef();

  const { mutateAsync: createVerifyCodeAsync, isPending: isPendingCreateVerifyCode } = useVerifyCodeCreate();

  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const { message } = App.useApp();

  async function handleSendVerifyCode() {
    await createVerifyCodeAsync({
      receiver: form.getFieldValue("email"),
      turnstile_token: form.getFieldValue("turnstile_token"),
      bizType: VerifyCodeBizType.注册,
      channel: VerifyCodeChannel.邮箱,
    })
      .then(() => {
        setCountdown(60);
        message.success("验证码已发送至邮箱");
      })
      .catch((e) => {
        turnstileRef.current?.reset();
        return Promise.reject(e);
      });
  }

  async function handleNextStep() {
    if (step === 1) {
      await form.validateFields(["email", "turnstile_token"]);
      await handleSendVerifyCode();
      setStep(step + 1);
    }
  }

  const { mutateAsync: registerAsync, isPending: isPendingRegister } = useUserRegister();
  const router = useRouter();

  async function handleFinishRegister() {
    await form.validateFields(["email", "email_verify_code", "password"]);
    await registerAsync({
      email: form.getFieldValue("email"),
      password: form.getFieldValue("password"),
      email_verify_code: form.getFieldValue("email_verify_code"),
    });
    router.push("/log-in?success=注册成功 请使用邮箱和密码登录");
  }

  return (
    <div className="w-full flex flex-col items-center max-w-xs mt-10">
      <div className="text-2xl font-bold mb-6">注册</div>
      <div className="w-full">
        {step === 2 ? (
          <Alert
            className="mb-4"
            type="success"
            message="验证码已发送至邮箱"
            showIcon
            action={
              <Button
                type="link"
                size="small"
                onClick={handleSendVerifyCode}
                disabled={countdown > 0}
                loading={isPendingCreateVerifyCode}
              >
                {countdown > 0 ? `${countdown}秒后重新发送` : "重新发送"}
              </Button>
            }
          />
        ) : null}
        <Form size="large" layout="vertical" form={form}>
          <Form.Item hidden={step !== 1} noStyle>
            <Form.Item
              name="email"
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
                  message: "请输入邮箱",
                },
              ]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item name="turnstile_token" rules={[{ required: true, message: "请先完成校验" }]}>
              <TurnstileInput ref={turnstileRef} />
            </Form.Item>
          </Form.Item>
          <Form.Item hidden={step !== 2} noStyle>
            <Form.Item
              name="email_verify_code"
              label="邮箱验证码"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="请输入邮箱验证码" />
            </Form.Item>
            <Form.Item
              name="password"
              label="账号密码"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password placeholder="请为账号设置密码" />
            </Form.Item>
          </Form.Item>
        </Form>
        <div className="flex justify-between items-center gap-x-2">
          {step === 1 ? (
            <Button
              size="large"
              type="primary"
              block
              onClick={handleNextStep}
              loading={isPendingCreateVerifyCode}
            >
              下一步
            </Button>
          ) : step === 2 ? (
            <>
              <Button size="large" onClick={() => setStep(step - 1)}>
                返回
              </Button>
              <Button
                size="large"
                type="primary"
                block
                onClick={handleFinishRegister}
                loading={isPendingCreateVerifyCode}
              >
                完成注册
              </Button>
            </>
          ) : null}
        </div>
        <div className="text-sm text-gray-500 mt-6 text-center">
          已有账号? <Link href="/log-in">点击登录</Link>
        </div>
        <Divider plain className="mt-6">
          或者
        </Divider>
        <div>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
