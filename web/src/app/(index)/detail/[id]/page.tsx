"use client";

import { taskApi } from "@/api/task";
import { useTask, useTaskGenLimit } from "@/api/task/hook";
import { TaskResult, TaskStatus } from "@/api/task/type";
import { Button, Result, Skeleton } from "antd";
import { use, useEffect, useMemo } from "react";
import PetResult from "./_components/PetResult";
import PetLoading from "./_components/PetLoading";
import Link from "next/link";
import NotFoundPet from "./_components/NotFoundPet";

export default function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, refetch, isPending } = useTask(id);
  const { refetch: refetchGenLimit } = useTaskGenLimit();

  useEffect(() => {
    let eventSource: EventSource;
    if (data?.status === TaskStatus.Processing) {
      eventSource = taskApi.sse(id);
      eventSource.onmessage = (event) => {
        const eventData = JSON.parse(event.data) as { type: string; id: string };
        if (eventData.type === "completed") {
          refetch();
          refetchGenLimit();
          eventSource.close();
        }
      };
    }
    return () => {
      eventSource?.close();
    };
  }, [data, id, refetch]);

  const result = useMemo<TaskResult | undefined>(() => {
    if (data?.result) {
      return JSON.parse(data.result);
    }
    return undefined;
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-transparent to-primary-100">
      <div className="container mx-auto pt-32 px-4 md:px-0">
        {isPending ? (
          <Skeleton active />
        ) : data?.status === TaskStatus.Processing ? (
          <PetLoading path={data?.path} />
        ) : data?.status && data.status === TaskStatus.Ok && result?.pets.length ? (
          <PetResult data={result} path={data?.path} />
        ) : data?.status === TaskStatus.Ok && result?.pets.length === 0 ? (
          <NotFoundPet path={data.path}></NotFoundPet>
        ) : (
          <Result
            status="error"
            title="分析出错了！"
            subTitle={data?.error_message || "未知错误"}
            extra={
              <Link href="/">
                <Button type="primary">返回</Button>
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
