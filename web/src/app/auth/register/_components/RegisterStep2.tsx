import { Alert, App, Button, Form, Input } from "antd";
import { RegisterStep1Data } from "./RegisterStep1";
import { useEffect, useState } from "react";
import { useVerifyCodeCreate } from "@/api/verify-code/hook";
import { VerifyCodeBizType, VerifyCodeChannel } from "@/type/common";

export function RegisterStep2(props: {
  step1Form: RegisterStep1Data;
  onSuccess: (step2Form: { email_verify_code: string }) => void;
  onBack: () => void;
}) {
  const [form] = Form.useForm();

  const { message } = App.useApp();

  const [countdown, setCountdown] = useState(0);

  // 倒计时效果
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const { mutateAsync: sendAsync, isPending: isPendingSend } = useVerifyCodeCreate();

  async function handleSendEmailCode() {
    await sendAsync({
      receiver: props.step1Form.email,
      bizType: VerifyCodeBizType.注册,
      channel: VerifyCodeChannel.邮箱,
      turnstile_token: props.step1Form.turnstile_token,
    });
    message.success("验证码已发送");
    setCountdown(60); // 设置60秒倒计时
  }

  useEffect(() => {
    if (props.step1Form) {
      handleSendEmailCode();
    }
  }, []);

  return (
    <div>
      <Alert
        className="mb-8"
        type="success"
        showIcon
        message={`验证码已发送至${props.step1Form?.email}`}
      ></Alert>
      <Form layout="vertical" size="large" form={form} onFinish={props.onSuccess}>
        <Form.Item
          label="邮箱验证码"
          name="email_verify_code"
          rules={[{ required: true, message: "请输入邮箱验证码" }]}
        >
          <Input
            placeholder="请输入邮箱验证码"
            suffix={
              <Button
                type="link"
                size="middle"
                className="p-0 h-auto"
                disabled={countdown > 0}
                onClick={handleSendEmailCode}
              >
                {countdown > 0 ? `${countdown}秒后重新发送` : "重新发送"}
              </Button>
            }
          />
        </Form.Item>
        <Button className="mt-2" block type="primary" htmlType="submit" loading={isPendingSend}>
          完成注册
        </Button>
        <div className="mt-10 flex items-center justify-center">
          <Button
            block
            type="link"
            htmlType="button"
            onClick={() => props.onBack()}
            className="w-auto"
            size="middle"
          >
            返回上一步
          </Button>
        </div>
      </Form>
    </div>
  );
}
