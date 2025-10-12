"use client";
import { MdOutlinePets } from "react-icons/md";
import React from "react";
import Uploader from "./_components/Uploader";

export default function () {
  // 案例数据
  const petCases: any[] = [
    {
      id: 1,
      name: "Max",
      type: "Dog",
      emotion: "Happy",
      confidence: 98,
      imageUrl: "https://picsum.photos/id/237/400/300",
    },
    {
      id: 2,
      name: "Luna",
      type: "Cat",
      emotion: "Relaxed",
      confidence: 95,
      imageUrl: "https://picsum.photos/id/40/400/300",
    },
    {
      id: 3,
      name: "Charlie",
      type: "Dog",
      emotion: "Anxious",
      confidence: 92,
      imageUrl: "https://picsum.photos/id/169/400/300",
    },
    {
      id: 4,
      name: "Bella",
      type: "Cat",
      emotion: "Curious",
      confidence: 97,
      imageUrl: "https://picsum.photos/id/96/400/300",
    },
  ];

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
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://picsum.photos/id/1025/600/500"
                  alt="Happy dog with owner"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-center gap-3">
                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">Happy</span>
                    <span className="text-white text-sm font-medium">98% confidence</span>
                  </div>
                </div>
              </div>

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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
                <p className="text-gray-600 max-w-xl">
                  Browse through these examples to see how our AI accurately detects different emotions in
                  various pets.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {petCases.map((petCase) => (
                <div
                  key={petCase.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={petCase.imageUrl}
                      alt={`${petCase.name} the ${petCase.type}`}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs px-3 py-1 rounded-ful`}>{petCase.emotion}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-lg">{petCase.name}</h3>
                      <span className="text-sm text-gray-500">{petCase.type}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Confidence: <span className="font-medium">{petCase.confidence}%</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
