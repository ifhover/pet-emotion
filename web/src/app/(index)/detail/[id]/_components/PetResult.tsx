import { TaskResult } from "@/api/task/type";
import { useMemo, useRef, useState } from "react";
import PetSelector from "./PetSelector";
import { Alert, Button, Modal, Table } from "antd";
import Color from "color";

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

  const [selectedLevel, setSelectedLevel] = useState<number>(0);

  const levels = useMemo(() => {
    return [
      {
        ...pet.emotion,
        name: "情绪指数",
        color: "#70A1D7",
        score_percent: (pet.emotion.score + 100) / 2,
        score: pet.emotion.score,
      },
      {
        ...pet.BCS,
        name: "BCS分数",
        color: "#A1DE93",
        score_percent: [4, 5].includes(pet.BCS.score)
          ? 100
          : Number(pet.BCS.score) > 5
            ? ((9 - pet.BCS.score) / 4) * 100
            : ((pet.BCS.score - 1) / 4) * 100,
      },
      {
        ...pet.comfort,
        name: "舒适指数",
        score_percent: pet.comfort.score,
        score: `${pet.comfort.score}%`,
        color: "#FAB57A",
      },
    ];
  }, [pet]);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <div>
      <div className="text-3xl font-bold mb-6">🐾分析报告</div>
      <div className="pb-10">
        <div className="flex gap-x-10 items-start">
          <div className="w-2/6 ">
            <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
              <div className="relative">
                <img ref={imgRef} className="w-full object-cover" src={path || ""} alt="分析结果" />
                <div className="flex gap-x-2 mt-4 absolute bottom-2 left-2 z-10">
                  {pet.tags.map((tag) => (
                    <div
                      key={tag}
                      className="px-1 bg-primary-500 rounded-sm text-white shadow-xs text-shadow-2xs text-shadow-gray-500"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
                {data.pets.length > 1 &&
                  data.pets.map((x, i) => {
                    const [x1, y1, x2, y2] = x.bbox_2d;
                    return (
                      <div
                        key={i}
                        className={`border-3 border-dashed border-primary-500 backdrop-brightness-130 absolute rounded-lg ${selected === i ? "border-primary-400" : "hidden"}`}
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
                    style={{ width: (pet.emotion.score + 100) / 2 + "%" }}
                  ></div>
                </div>
                <div className="relative h-6 mt-2">
                  <div className="absolute top-0 left-0 text-gray-400">😫恐惧</div>
                  <div className="absolute top-0 right-0 text-gray-400">🤗开心</div>
                </div>
              </div>
            </div>
            <Alert
              className="mt-6"
              message="该结果仅供参考，不构成医疗建议。如需进一步诊断，请咨询专业兽医。"
              showIcon
              type="info"
            />
          </div>
          <div className="w-4/6">
            {data.pets.length > 1 ? (
              <PetSelector result={data} path={path} selected={selected} onChaneSelected={setSelected} />
            ) : null}
            <div className="bg-white rounded-2xl shadow-2xs p-6 mb-6">
              <div className="text-xl font-bold mb-7">🌻情绪分析</div>
              <div className="bg-gray-100 p-4 rounded-2xl mb-4">{pet.summary}</div>
              <div className="grid grid-cols-3 justify-center gap-x-12 ">
                {levels.map((level, index) => (
                  <div
                    key={level.level}
                    style={{ "--color": level.color } as React.CSSProperties}
                    className={`relative flex flex-col items-center p-4 cursor-pointer rounded-xl rounded-b-none 
                      ${selectedLevel === index ? `bg-[var(--color)]/10` : ""}`}
                    onClick={() => setSelectedLevel(index)}
                  >
                    <div className="w-20 h-20 bg-[var(--color)]/50 rounded-full flex items-center justify-center text-3xl">
                      {level.emoji}
                    </div>
                    <div className="mt-2 text-base font-bold">{level.level}</div>
                    <div className="w-full flex justify-between items-center mt-4">
                      <div className="text-center text-sm text-gray-500">{level.name}</div>
                      <div className="font-bold">{level.score}</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-2xl h-2.5 mt-1">
                      <div
                        className="h-full bg-[var(--color)] rounded-2xl"
                        style={{ width: level.score_percent + "%" }}
                      ></div>
                    </div>
                    {index === selectedLevel ? (
                      <>
                        {index !== 0 ? (
                          <div className="absolute bg-[var(--color)]/10 w-5 h-5 bottom-0 right-full">
                            <div className="w-full h-full bg-white rounded-br-xl "></div>
                          </div>
                        ) : null}
                        {index !== levels.length - 1 ? (
                          <div className="absolute bg-[var(--color)]/10 w-5 h-5 left-full bottom-0">
                            <div className="w-full h-full bg-white rounded-bl-xl "></div>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                ))}
              </div>
              <div
                style={{ "--color": levels[selectedLevel].color } as React.CSSProperties}
                className={`text-gray-700 text-sm bg-[var(--color)]/10 p-4 rounded-xl 
                  ${selectedLevel === 0 ? "rounded-tl-none" : selectedLevel === levels.length - 1 ? "rounded-tr-none" : ""}`}
              >
                {levels[selectedLevel].desc}
                <span className="text-gray-500 text-sm ml-2">
                  (可靠度: {levels[selectedLevel].confidence * 100}%)
                </span>
                {selectedLevel === 1 ? (
                  <div className="mt-2">
                    <a type="link" onClick={() => setModalVisible(true)}>
                      什么是BCS分数
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
            <Modal
              title="什么是BCS分数"
              open={modalVisible}
              onCancel={() => setModalVisible(false)}
              footer={false}
            >
              <div className="text-gray-700 pt-2">
                BCS评分法，全称是体况评分系统，是一种主观评估宠物身体脂肪含量和肌肉状况的标准化方法。
              </div>
              <div className="mt-1">它的核心目的是判断宠物是偏瘦、理想还是偏重。</div>
              <Table
                className="mt-2"
                size="small"
                bordered
                pagination={false}
                rowKey="score"
                columns={[
                  {
                    title: "分数",
                    dataIndex: "score",
                  },
                  {
                    title: "描述",
                    dataIndex: "desc",
                  },
                ]}
                dataSource={[
                  {
                    score: "1~3分",
                    desc: "偏瘦",
                  },
                  {
                    score: "4~5分",
                    desc: "理想",
                  },
                  {
                    score: "6~9分",
                    desc: "偏重",
                  },
                ]}
              />
              <div className="mt-2 text-sm">
                <div className="font-medium text-base mb-1">如何使用BCS评分法？</div>
                <div className="text-gray-500 mb-2">您可以按照以下步骤在家为您的宠物进行初步评估：</div>
                <div className="font-medium mb-1">看（视觉评估）：</div>
                <div className="mb-2 text-gray-600">
                  从正上方俯视您的宠物，看它的身体轮廓。应该能看到一个清晰的腰部曲线（像沙漏一样）。
                  <br />
                  从侧面观察，看它的腹部是否在肋骨后方有明显的“收起”或上提，而不是与胸部呈一条直线下垂。
                </div>
                <div className="font-medium mb-1">摸（触觉评估）：</div>
                <div className="mb-2 text-gray-600">
                  摸肋骨：将您的手掌平放，手背朝上。用手指轻轻拂过手背的指关节——这就是能摸到肋骨但看不到时的感觉。如果能直接看到肋骨，说明太瘦；如果需要用力按压才能感觉到肋骨，说明太胖。
                  <br />
                  摸脊柱和骨盆：沿着背部中线的脊椎骨应该能轻易摸到，但不会像“洗衣板”一样尖锐凸出。骨盆的骨骼也应该能触摸到。
                </div>
                <div className="font-medium mb-1">最重要的一点：</div>
                <div className="text-gray-600 ">
                  如果您不确定，或者您的宠物被评估为偏瘦（3分及以下）或超重（6分及以上），请务必咨询您的兽医。他们可以提供最专业的评估，并帮助您制定科学的饮食和运动计划。
                </div>
              </div>
            </Modal>
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
