"use client";

import PageContainer from "@/components/PageContainer";
import { Button, Card, Form, Image, Select, Space, Table, Tag } from "antd";
import { useTaskList } from "@/api/task/hook";
import { TaskListReq, TaskStatus } from "@/api/task/type";
import { useState } from "react";
import dayjs from "dayjs";
import { copyToClipboard } from "@/utils/copy";
import { App } from "antd";
import usePage from "@/hooks/usePage";
import TaskModal, { useTaskModalRef } from "./_components/TaskModal";

export default function () {
  const [queryParams, setQueryParams] = useState<TaskListReq>({});
  const page = usePage();
  const [form] = Form.useForm();
  const taskModalRef = useTaskModalRef();
  const { message } = App.useApp();
  const { data: taskList, refetch } = useTaskList({ ...queryParams, ...page.page });

  return (
    <PageContainer>
      <TaskModal ref={taskModalRef} />
      <Card className="mb-4">
        <Form
          layout="inline"
          className="grid grid-cols-5 gap-4"
          onFinish={(values) => setQueryParams(values)}
          form={form}
        >
          <Form.Item label="状态" name="status">
            <Select
              placeholder="请选择状态"
              allowClear
              options={[
                { label: "处理中", value: TaskStatus.Processing },
                { label: "已完成", value: TaskStatus.Ok },
                { label: "失败", value: TaskStatus.Error },
              ]}
            />
          </Form.Item>
          <Form.Item className="col-start-5">
            <div className="flex gap-2 justify-end">
              <Button type="primary" onClick={() => form.submit()}>
                查询
              </Button>
              <Button onClick={() => refetch()}>刷新</Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
      <Card title="任务列表">
        <Table
          rowKey="id"
          dataSource={taskList?.list}
          pagination={{
            pageSize: page.page.page_size,
            current: page.page.page_index,
            total: taskList?.total,
            onChange: page.onChange,
          }}
          columns={[
            {
              title: "ID",
              dataIndex: "id",
              width: 370,
              render: (value) => {
                return (
                  <Space>
                    <span>{value}</span>
                    <a
                      onClick={async () => {
                        await copyToClipboard(value);
                        message.success("复制成功");
                      }}
                    >
                      复制
                    </a>
                  </Space>
                );
              },
            },
            {
              title: "图片",
              dataIndex: "path",
              render: (value) => {
                return <Image src={value} alt="图片" className="w-24 h-24 object-cover" />;
              },
            },
            {
              title: "状态",
              dataIndex: "status",
              render: (value) => {
                return (
                  <Tag
                    color={
                      value === TaskStatus.Processing ? "blue" : value === TaskStatus.Ok ? "green" : "red"
                    }
                  >
                    {value === TaskStatus.Processing ? "处理中" : value === TaskStatus.Ok ? "已完成" : "失败"}
                  </Tag>
                );
              },
            },
            {
              title: "评分",
              dataIndex: "grade",
            },
            {
              title: "创建时间",
              dataIndex: "created_at",
              render: (value) => {
                return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
              },
            },
            {
              title: "操作",
              dataIndex: "action",
              render: (_, record) => (
                <Space>
                  <Button type="primary" onClick={() => taskModalRef.current?.open(record.id)}>
                    编辑
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
}
