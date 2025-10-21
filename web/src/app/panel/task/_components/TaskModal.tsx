import { useTask, useTaskUpdate } from "@/api/task/hook";
import { TaskUpdateReq } from "@/api/task/type";
import { App, Form, InputNumber, Modal } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

export function useTaskModalRef() {
  const ref = useRef<{
    open: (id: string) => void;
    close: () => void;
  }>(null);
  return ref;
}

export default forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [id, setId] = useState<string | undefined>(undefined);
  const { data: task } = useTask(id);

  const { message } = App.useApp();

  useEffect(() => {
    if (task) {
      form.setFieldsValue(task);
    }
  }, [task]);

  const { mutateAsync, isPending } = useTaskUpdate();

  useImperativeHandle(ref, () => ({
    open: (id?: string) => {
      setId(id);
      setOpen(true);
    },
    close: () => setOpen(false),
  }));

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      onOk={() => form.submit()}
      okButtonProps={{ loading: isPending }}
      title="编辑任务"
    >
      <Form<Omit<TaskUpdateReq, "id">>
        className="pt-4"
        form={form}
        onFinish={async (values) => {
          await mutateAsync({ id: id!, ...values });
          setOpen(false);
          message.success("更新成功");
        }}
      >
        <Form.Item label="评分" name="grade">
          <InputNumber className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
});
