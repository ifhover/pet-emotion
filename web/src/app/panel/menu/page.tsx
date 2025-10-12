"use client";

import PageContainer from "@/components/PageContainer";
import { Table, Button, Card, Space, App } from "antd";
import { MenuFormModal } from "./_components/MenuFormModal";
import { useState } from "react";
import { useMenuDelete, useMenuList } from "@/api/menu/hook";

export default function MenuPage() {
  const { modal, message } = App.useApp();

  const { data: menus, isLoading } = useMenuList();

  function handleEdit(id: string) {
    setOpen(true);
    setId(id);
  }

  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string | undefined>(undefined);

  function handleAdd() {
    setOpen(true);
    setId(undefined);
  }

  const { mutateAsync } = useMenuDelete();

  function handleDelete(id: string) {
    modal.confirm({
      title: "删除菜单",
      content: "确定删除该菜单吗？",
      onOk: async () => {
        await mutateAsync(id);
        message.success("删除成功");
      },
    });
  }

  return (
    <PageContainer>
      <MenuFormModal
        id={id}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />
      <Card
        loading={isLoading}
        title="菜单列表"
        extra={
          <Button type="primary" onClick={() => handleAdd()}>
            添加
          </Button>
        }
      >
        <Table
          rowKey="id"
          dataSource={menus}
          expandable={{ defaultExpandAllRows: true }}
          pagination={false}
          columns={[
            {
              title: "名称",
              dataIndex: "name",
            },
            {
              title: "路径",
              dataIndex: "path",
            },
            {
              title: "操作",
              dataIndex: "action",
              render: (_, record) => (
                <Space size="middle">
                  <a onClick={() => handleEdit(record.id)}>编辑</a>
                  <a onClick={() => handleDelete(record.id)}>删除</a>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
}
