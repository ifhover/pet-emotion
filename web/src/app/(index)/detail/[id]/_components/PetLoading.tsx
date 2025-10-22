import { Skeleton, Spin } from "antd";

export default function PetLoading({ path }: { path: string }) {
  return (
    <div className="pb-10 flex gap-x-10 items-start">
      <div className="flex gap-x-10 items-start w-full max-w-5xl">
        <div className="w-2/6 bg-white/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          <div className="relative">
            <img className="w-full object-cover" src={path || ""} alt="" />
            <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-md flex flex-col justify-center items-center">
              <Spin percent="auto" size="large"></Spin>
              <div className="text-base mt-2 text-primary-500 font-medium text-shadow-white/20 text-shadow-md">
                分析中...
              </div>
            </div>
          </div>
        </div>
        <div className="w-4/6 space-y-5">
          <Skeleton active />
          <Skeleton active />
        </div>
      </div>
    </div>
  );
}
