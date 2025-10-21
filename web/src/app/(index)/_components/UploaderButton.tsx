import { useTaskCreate, useTaskGenLimit } from "@/api/task/hook";
import PetButton from "./PetButton";
import { useRouter } from "next/navigation";
import { useLimitModalRef } from "./LimitModal";
import LimitModal from "./LimitModal";

export default function UploaderButton() {
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

  const { data: limit, isPending: isPendingLimit } = useTaskGenLimit();
  const limitModalRef = useLimitModalRef();
  function handleClick(e: React.MouseEvent<HTMLLabelElement>) {
    if (limit !== undefined) {
      if (limit === 0) {
        e.preventDefault();
        limitModalRef.current?.open();
      }
    }
  }

  return (
    <div>
      <label htmlFor="file-upload" onClick={handleClick}>
        <input
          id="file-upload"
          type="file"
          accept=".jpg,.png,.jpeg"
          className="hidden"
          onChange={handleFileChange}
        />
        <PetButton loading={isPending} type="normal">
          重新上传
        </PetButton>
      </label>
      <LimitModal ref={limitModalRef} />
    </div>
  );
}
