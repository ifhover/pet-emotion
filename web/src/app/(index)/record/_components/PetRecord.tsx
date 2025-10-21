import { useTaskMyRecords } from "@/api/task/hook";
import TaskItem from "./TaskItem";

export default function PetRecord() {
  const { data: records } = useTaskMyRecords();

  return (
    <div>
      <div className="text-3xl font-bold mb-6">🐾分析记录</div>
      <div className="grid grid-cols-4 gap-5">
        {records?.map((record) => (
          <TaskItem key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}
