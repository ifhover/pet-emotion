import { Task, TaskResult } from "@/api/task/type";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo } from "react";

type Props = {
  record: Task;
};
export default function TaskItem({ record }: Props) {
  const pet = useMemo(() => {
    return (JSON.parse(record.result || "[]") as TaskResult).pets?.[0] ?? null;
  }, [record]);
  return (
    <Link href={`/detail/${record.id}`} className="bg-white rounded-2xl shadow-2xs overflow-hidden group">
      <div className="w-full h-64 relative flex flex-col justify-end">
        <div className="absolute top-2 right-2 text-sm text-white z-10 text-shadow-black/20 text-shadow-lg font-medium text-right">
          情绪指数
          <div className="text-2xl">{pet?.emotion.score || "--"}</div>
        </div>
        <img
          className="w-full h-64 object-cover absolute z-0 inset-0 group-hover:scale-110 transition-all duration-300"
          src={record.path}
          alt=""
        />
        <div className="relative z-20 text-white text-shadow-black/20 text-shadow-lg">
          <div className="px-3 py-2 flex justify-end">
            {dayjs(record?.created_at).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        </div>
      </div>
    </Link>
  );
}
