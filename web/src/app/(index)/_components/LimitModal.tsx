"use client";

import { Button, Modal, Space } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useTaskGenLimit } from "@/api/task/hook";
import { useUserMyDetail } from "@/api/user/hook";
import Link from "next/link";

export function useLimitModalRef() {
  const ref = useRef<{
    open: () => void;
    close: () => void;
  }>(null);
  return ref;
}

export default forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const { data: limit } = useTaskGenLimit();
  const { data: user } = useUserMyDetail();

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  return (
    <Modal
      title="提示"
      open={open}
      onCancel={() => setOpen(false)}
      footer={
        <Space>
          {user ? (
            <Button onClick={() => setOpen(false)} type="primary">
              确定
            </Button>
          ) : (
            <Link href="/log-in">
              <Button type="primary">去登录</Button>
            </Link>
          )}
        </Space>
      }
    >
      {user ? (
        <p className="pt-4">今日分析次数已用尽，请明天再来</p>
      ) : (
        <p className="pt-4">试用次数已用尽，登陆后获取更多次数</p>
      )}
    </Modal>
  );
});
