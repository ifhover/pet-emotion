import { MdOutlinePets } from "react-icons/md";
import { useState } from "react";
import { Spin } from "antd";
import { useTaskCreate } from "@/api/task/hook";
import { useRouter } from "next/navigation";

export default function Uploader() {
  const { mutateAsync, isPending } = useTaskCreate();
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await mutateAsync(formData);
      router.push(`/detail/${res.id}`);
    }
  };

  return (
    <div className="rounded-2xl *:rounded-2xl text-center bg-white/50 shadow-sm h-80 *:flex *:justify-center *:items-center">
      {isPending ? (
        <div className="h-full flex-col">
          <Spin size="large"></Spin>
          <div className="mt-4 text-primary-700">上传中</div>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="h-full cursor-pointer border-2 border-dashed border-primary-300 hover:border-primary-500 transition-colors"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-500">
              <MdOutlinePets size={28} />
            </div>
            <h3 className="text-lg font-medium">上传你的宠物照片</h3>
            <p className="text-gray-500 text-sm">JPG, PNG</p>
            <input
              id="file-upload"
              type="file"
              accept=".jpg,.png,.jpeg"
              className="hidden"
              onChange={handleFileChange}
            />
            <button className="mt-4 bg-primary-600 text-white px-6 py-3 rounded-full transform shadow-md cursor-pointer">
              分析情绪
            </button>
          </div>
        </label>
      )}
    </div>
  );
}
