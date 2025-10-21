import { Task, TaskResult } from "@/api/task/type";
import Image from "next/image";
import { useMemo } from "react";

type Props = {
  data: Task;
};
export default function CasesItem(props: Props) {
  const result = useMemo(() => {
    return props.data.result ? ((JSON.parse(props.data.result) as TaskResult).pets?.[0] ?? null) : null;
  }, [props.data]);
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white">
      <div className="w-full h-40 relative">
        <Image
          width={0}
          height={0}
          sizes="100vw"
          src={props.data.path}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 left-2 flex gap-x-1">
          {result?.tags?.map((x) => (
            <div key={x} className="text-white bg-black/40 px-1 rounded-sm">
              {x}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 py-3">
        <div className="text-lg font-bold">{result?.breed}</div>
        <div className="w-full flex justify-between">
          <div>
            {result?.emotion.emoji}
            {result?.emotion.level}
          </div>
          <div className="flex items-center gap-x-2">
            情绪指数
            <div className="font-medium text-primary-500">{result?.emotion.score ?? 0 * 100}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
