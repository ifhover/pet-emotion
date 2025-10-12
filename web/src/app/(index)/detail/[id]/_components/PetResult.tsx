import { TaskResult } from "@/api/task/type";
import { useMemo, useRef, useState } from "react";
import PetSelector from "./PetSelector";

type Props = {
  data: TaskResult;
  path: string;
};
export default function PetResult({ path, data }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);

  const [selected, setSelected] = useState<number>(0);

  const pet = useMemo(() => {
    return data.pets[selected];
  }, [selected]);

  return (
    <div>
      <div className="text-3xl font-bold mb-6">🐾分析报告</div>
      <div className="pb-10">
        <div className="flex gap-x-10 items-start">
          <div className="w-2/6 bg-white/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
            <div className="relative">
              <img ref={imgRef} className="w-full object-cover" src={path || ""} alt="分析结果" />
              <div className="flex gap-x-2 mt-4 absolute bottom-2 left-2">
                {pet.tags.map((tag) => (
                  <div
                    key={tag}
                    className="px-1 bg-primary-500 rounded-sm text-white shadow-xs text-shadow-2xs text-shadow-gray-500"
                  >
                    {tag}
                  </div>
                ))}
              </div>
              {data.pets.map((x, i) => {
                const [x1, y1, x2, y2] = x.bbox_2d;
                return (
                  <div
                    key={i}
                    className={`border-3 border-dashed border-primary-500 backdrop-brightness-110 absolute rounded-sm ${selected === i ? "border-primary-400" : "hidden"}`}
                    data-position={x.bbox_2d.join(",")}
                    style={{
                      top: y1 / 10 + "%",
                      left: x1 / 10 + "%",
                      height: (y2 - y1) / 10 + "%",
                      width: (x2 - x1) / 10 + "%",
                    }}
                  ></div>
                );
              })}
            </div>
            <div className="px-5 py-4">
              <div className="text-center text-3xl mb-3 pt-2 font-bold">{pet.breed}</div>
              <div className="text-center text-sm text-gray-400 mb-5">{pet.emotion_condition}</div>
              <div className="bg-gray-200 rounded-2xl h-7">
                <div
                  className="h-full bg-primary-400 rounded-2xl"
                  style={{ width: pet.emotions.happiness + "%" }}
                ></div>
              </div>
              <div className="relative h-6 mt-2">
                <div className="absolute top-0 left-0 text-gray-400">😣低落</div>
                <div className="absolute top-0 right-0 text-gray-400">🤗开心</div>
              </div>
            </div>
          </div>
          <div className="w-4/6">
            <PetSelector result={data} path={path} selected={selected} onChaneSelected={setSelected} />
            <div className="bg-white rounded-2xl shadow-2xs p-6 mb-6">
              <div className="text-xl font-bold mb-7">🌻情绪分析</div>
              <div className="grid grid-cols-4 justify-center  gap-x-8">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center text-3xl">
                    😄
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-2">开心指数</div>
                  <div className="text-xl font-bold mb-1">{pet.emotions.happiness}%</div>
                  <div className="w-full bg-gray-200 rounded-2xl h-2.5">
                    <div
                      className="h-full bg-green-500 rounded-2xl"
                      style={{ width: pet.emotions.happiness + "%" }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-cyan-200 rounded-full flex items-center justify-center text-3xl">
                    🤔
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-2">好奇指数</div>
                  <div className="text-xl font-bold mb-1">{pet.emotions.curiosity}%</div>
                  <div className="w-full bg-gray-200 rounded-2xl h-2.5">
                    <div
                      className="h-full bg-cyan-500 rounded-2xl"
                      style={{ width: pet.emotions.curiosity + "%" }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center text-3xl">
                    😶‍🌫️
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-2">警觉指数</div>
                  <div className="text-xl font-bold mb-1">{pet.emotions.alertness}%</div>
                  <div className="w-full bg-gray-200 rounded-2xl h-2.5">
                    <div
                      className="h-full bg-amber-500 rounded-2xl"
                      style={{ width: pet.emotions.alertness + "%" }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-sky-800/45 rounded-full flex items-center justify-center text-3xl">
                    🥱
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-2">疲惫指数</div>
                  <div className="text-xl font-bold mb-1">{pet.emotions.fatigue}%</div>
                  <div className="w-full bg-gray-200 rounded-2xl h-2.5">
                    <div
                      className="h-full bg-sky-500 rounded-2xl"
                      style={{ width: pet.emotions.fatigue + "%" }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-2xl mt-6">{pet.summary}</div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xs p-6">
              <div className="text-xl font-bold mb-7">🌱健康状况分析</div>
              <div className="grid gap-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-gray-600 text-base">整体健康评分</div>
                    <div className="font-bold text-base font-bol">{pet.health.score}/100</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-2xl h-2.5">
                    <div
                      className="h-full bg-green-500 rounded-2xl"
                      style={{ width: pet.health.score + "%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="text-gray-700 font-medium text-base mb-2">身体状况评估</div>
                  <div className="text-gray-500 text-sm">{pet.health.body_condition}</div>
                </div>
                <div>
                  <div className="text-gray-700 font-medium text-base mb-2">毛发/皮肤状况</div>
                  <div className="text-gray-500 text-sm">{pet.health.coat_condition}</div>
                </div>
                <div>
                  <div className="text-gray-700 font-medium text-base mb-2">潜在关注点</div>
                  <div className="text-gray-500 text-sm">{pet.health.concerns}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
