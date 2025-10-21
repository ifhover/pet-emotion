import UploaderButton from "@/app/(index)/_components/UploaderButton";

export default function NotFoundPet({ path }: { path: string }) {
  return (
    <div>
      <div className="text-3xl font-bold mb-6">🐾分析报告</div>
      <div className="flex gap-x-10">
        <div className="w-2/6 rounded-2xl shadow-xl overflow-hidden">
          <img className="w-full" src={path} alt="" />
        </div>
        <div className="w-4/6">
          <div className="text-3xl font-bold mb-6">🤔没有在这个照片中找到宠物哦</div>
          <div className="text-sm text-gray-500 mb-4">请仔细检查一下是否上传了正确的照片</div>
          <UploaderButton />
        </div>
      </div>
    </div>
  );
}
