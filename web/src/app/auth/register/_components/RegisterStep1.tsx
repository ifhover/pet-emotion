import { Form, Input, Button } from "antd";
import { useEffect } from "react";
import { useUserCheckEmail } from "@/api/user/hook";
import TurnstileInput from "@/components/TurnstileInput";
import Link from "next/link";

export type RegisterStep1Data = {
  email: string;
  password: string;
  turnstile_token: string;
};

type Props = {
  data?: RegisterStep1Data;
  onSuccess: (data: RegisterStep1Data) => void;
};

export function RegisterStep1(props: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.data) {
      form.setFieldsValue(props.data);
    }
  }, [props.data]);

  const { mutateAsync } = useUserCheckEmail();

  return (
    <>
      <Form layout="vertical" size="large" form={form} onFinish={props.onSuccess}>
        <Form.Item
          label="邮箱"
          name={"email"}
          validateTrigger={["onBlur", "onChange"]}
          validateFirst
          rules={[
            { required: true, message: "请输入邮箱" },
            {
              validateTrigger: "onBlur",
              type: "email",
              message: "请输入正确格式的邮箱",
            },
            {
              validateTrigger: [],
              async validator(_, value: string) {
                let valid = await mutateAsync({ email: value });
                if (valid) return Promise.resolve();
                return Promise.reject("当前邮箱已被注册");
              },
            },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item label="密码" name={"password"} rules={[{ required: true, message: "请输入密码" }]}>
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item rules={[{ required: true, message: "请先完成验证" }]} name="turnstile_token">
          <TurnstileInput />
        </Form.Item>
        <Button block type="primary" htmlType="submit">
          下一步
        </Button>
      </Form>
      <div className="text-center mt-5">
        已有账号？
        <Link href="./login" className="text-primary-500">
          点击登录
        </Link>
      </div>
    </>
  );
}
