import { Modal, Button, App, Input, TreeSelect, Spin } from "antd";
import { Form } from "antd";
import { useEffect } from "react";
import { useMenu, useMenuList, useMenuSave } from "@/api/menu/hook";
import { Menu } from "@server/modules/menu/type";

type Props = {
  id?: string;
  open: boolean;
  onClose: () => void;
};

export function MenuFormModal(props: Props) {
  const [form] = Form.useForm<Menu>();

  const { isFetching, data } = useMenu(props.open ? props.id : undefined);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  useEffect(() => {
    if (props.open) {
      form.resetFields();
    }
  }, [props.open]);

  const { mutateAsync, isPending } = useMenuSave();

  const { message } = App.useApp();

  async function handleSubmit(data: Menu) {
    await mutateAsync(data);
    props.onClose();
    message.success(props.id ? "更新成功" : "添加成功");
  }

  const { data: menus } = useMenuList();

  return (
    <Modal
      title="菜单表单"
      open={props.open}
      onCancel={props.onClose}
      okButtonProps={{ loading: isPending }}
      onOk={() => form.submit()}
    >
      <Spin spinning={isFetching}>
        <Form className="mt-5" form={form} onFinish={handleSubmit} labelCol={{ span: 4 }}>
          <Form.Item hidden name="id">
            <Input />
          </Form.Item>
          <Form.Item label="名称" name="name" rules={[{ required: true, message: "请输入名称" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="路径" name="path" rules={[{ required: true, message: "请输入路径" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="父级菜单" name="pid" initialValue={null}>
            <TreeSelect
              placeholder="请选择父级菜单（选填）"
              treeData={menus}
              fieldNames={{ label: "name", value: "id" }}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
