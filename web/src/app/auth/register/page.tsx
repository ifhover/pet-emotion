"use client";

import { Button, Spin, App, Result } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RegisterStep1, RegisterStep1Data } from "./_components/RegisterStep1";
import { RegisterStep2 } from "./_components/RegisterStep2";
import { useUserRegister } from "@/api/user/hook";

export default function Register() {
  const { message } = App.useApp();
  const router = useRouter();

  const { mutateAsync: registerAsync, isPending: isPendingRegister } = useUserRegister();

  const [step, setStep] = useState(1);
  let [step1Form, setStep1Form] = useState<RegisterStep1Data>();

  const step1Success = (data: RegisterStep1Data) => {
    setStep1Form(data);
    setStep(step + 1);
  };

  const step2Success = async (step2Form: { email_verify_code: string }) => {
    await registerAsync({
      email: step1Form!.email,
      password: step1Form!.password,
      email_verify_code: step2Form.email_verify_code,
    });
    setStep(step + 1);
    message.success("注册成功");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Register</h1>
      <p className="text-sm text-gray-500 mb-7">请输入您的信息</p>
      <Spin spinning={isPendingRegister}>
        {step === 1 && <RegisterStep1 data={step1Form} onSuccess={step1Success} />}
        {step === 2 && (
          <RegisterStep2 step1Form={step1Form!} onSuccess={step2Success} onBack={() => setStep(step - 1)} />
        )}
        {step === 3 && (
          <div>
            <Result
              status="success"
              title="注册成功"
              subTitle="请使用邮箱和密码登录"
              extra={
                <Button type="primary" onClick={() => router.push("/auth/login")}>
                  去登录
                </Button>
              }
            ></Result>
          </div>
        )}
      </Spin>
    </div>
  );
}
