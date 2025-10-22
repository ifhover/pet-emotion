import { TaskResult } from "@/api/task/type";
import { useEffect, useMemo, useState } from "react";

export type Props = {
  result: TaskResult;
  path: string;
  selected: number;
  onChaneSelected: (index: number) => void;
};

export default function PetSelector({ result, path, selected, onChaneSelected }: Props) {
  const pets = result.pets;
  const [images, setImages] = useState<string[]>([]);

  async function updateImages() {
    let result = [];
    const image = await new Promise<HTMLImageElement>((resolve) => {
      const img = document.createElement("img");
      img.crossOrigin = "Anonymous";
      img.addEventListener("load", () => {
        resolve(img);
      });
      img.src = path;
    });
    const canvas = document.createElement("canvas");
    for (const pet of pets) {
      let width = ((pet.bbox_2d[2] - pet.bbox_2d[0]) / 1000) * image.width;
      let height = ((pet.bbox_2d[3] - pet.bbox_2d[1]) / 1000) * image.height;
      let left = (pet.bbox_2d[0] / 1000) * image.width;
      let top = (pet.bbox_2d[1] / 1000) * image.height;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(image, left, top, width, height, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/png");
      result.push(dataUrl);
    }
    setImages(result);
  }

  useEffect(() => {
    updateImages();
  }, [pets]);

  return (
    <div className="mb-5">
      <div className="text-xl font-bold mb-1">🐾宠物选择</div>
      <div className="text-sm text-gray-400">照片中共有{pets.length}只宠物，我要查看的是:</div>
      <div className="grid grid-cols-3 gap-x-4 gap-y-2 mt-3">
        {images.map((image, index) => (
          <div
            className={`border-2 border-dashed flex px-3 py-2 rounded-2xl transition-all ${selected === index ? "bg-primary-50 border-primary-400" : "bg-white border-transparent cursor-pointer hover:border-primary-400"}`}
            key={index}
            onClick={() => onChaneSelected(index)}
          >
            <div className="w-16 h-20 bg-gray-200 border border-gray-200 rounded-lg overflow-hidden shrink-0">
              <img key={index} src={image} alt="" className="size-full object-cover object-top-left" />
            </div>
            <div className="text-sm ml-2 pt-0.5">
              <div className="text-base font-bold text-gray-700">{pets[index].breed}</div>
              <div className="text-gray-500 mt-1">{pets[index].position_desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
