import React, { useMemo } from "react";
import Uploader from "./_components/Uploader";
import { TaskResult } from "@/api/task/type";
import { taskApi } from "@/api/task";
import Image from "next/image";
import CasesItem from "./_components/CasesItem";

export default async function () {
  const indexCases = await taskApi.indexCases().then((res) => {
    return {
      top: res.top ? { ...res.top, result: JSON.parse(res.top.result || "[]") as TaskResult } : null,
      bottom_list: res.bottom_list,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-transparent to-primary-100 ">
      <main className="pt-20">
        {/* 英雄区域 */}
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-24">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span>了解你的宠物</span>
                <span className="bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent text-nowrap">
                  &nbsp;情绪
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                我们的AI工具可以分析宠物的面部表情和肢体语言，帮助你理解它们的情感状态，加强你和你毛茸茸的朋友之间的联系。
              </p>

              {/* 上传区域 */}
              <div className="mt-8">
                <Uploader />
              </div>
            </div>

            <div className="md:w-1/2 relative">
              {indexCases.top ? (
                <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    src={indexCases.top.path}
                    priority={true}
                    alt="Happy dog with owner"
                    className="w-full h-auto! object-cover"
                  />
                  <div className="absolute top-4 left-4 text-white">
                    *{indexCases.top.result.pets[0].position_desc}
                  </div>
                  <div className="absolute top-4 right-4 flex flex-col gap-y-2 items-end w-56">
                    <div className="text-white text-sm font-medium">
                      {indexCases.top.result.pets[0].emotion.emoji}{" "}
                      {indexCases.top.result.pets[0].emotion.level}
                    </div>
                    <div className="text-gray-200">{indexCases.top.result.pets[0].comfort.desc}</div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <div className="flex items-center gap-3">
                      {indexCases.top.result.pets[0].tags.map((x) => {
                        return (
                          <span key={x} className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                            {x}
                          </span>
                        );
                      })}
                      <span className="text-white text-sm font-medium">
                        {indexCases.top.result.pets[0].emotion.confidence * 100}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* 装饰元素 */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-200 rounded-full opacity-50 blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-pink-200 rounded-full opacity-50 blur-xl"></div>
            </div>
          </div>
        </section>

        {/* 案例展示 */}
        <section id="examples" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">示例</h2>
                <p className="text-gray-600 max-w-xl">
                  浏览这些例子，看看我们的人工智能是如何准确地检测到不同宠物的不同情绪的。
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {indexCases.bottom_list.map((item) => (
                <CasesItem key={item.id} data={item}></CasesItem>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
