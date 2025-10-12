"use client";

import { taskApi } from "@/api/task";
import { useTask } from "@/api/task/hook";
import { TaskResult, TaskStatus } from "@/api/task/type";
import { Skeleton, Space, Spin } from "antd";
import { use, useEffect, useMemo } from "react";
import PetResult from "./_components/PetResult";
import PetLoading from "./_components/PetLoading";

export default function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, refetch, isPending } = useTask(id);

  useEffect(() => {
    let eventSource: EventSource;
    if (data?.status === TaskStatus.Processing) {
      eventSource = taskApi.sse(id);
      eventSource.onmessage = (event) => {
        const eventData = JSON.parse(event.data) as { type: string; id: string };
        if (eventData.type === "completed") {
          refetch();
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
        ) : data?.status && data.status === TaskStatus.Ok && result ? (
          <PetResult data={result} path={data?.path} />
        ) : (
          <div className="text-center text-base">
            <div className="text-red-500 font-bold mb-4">分析失败</div>
            {data?.error_message}
          </div>
        )}
      </div>
    </div>
  );
}
