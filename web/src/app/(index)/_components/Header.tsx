"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  // 监听滚动事件，用于导航栏样式变化
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/40  backdrop-brightness-110 py-3 backdrop-blur-md shadow-xs"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-transparent from-primary-700 to-primary-600 bg-gradient-to-r bg-clip-text">
              PetEmotionAI
            </span>
          </div>

          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center space-x-8 *:not-[button]:text-neutral-700">
            <Link href="/" className=" font-medium transition-colors">
              首页
            </Link>
            <a href="#how-it-works" className="font-medium  transition-colors">
              分析记录
            </a>
          </nav>

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden text-gray-700"
            // onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {/* {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />} */}
          </button>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 p-4 flex flex-col space-y-4 animate-fadeIn">
          <a href="#" className="font-medium py-2 hover:text-pink-500 transition-colors">
            Home
          </a>
          <a href="#how-it-works" className="font-medium py-2 hover:text-pink-500 transition-colors">
            How It Works
          </a>
          <a href="#examples" className="font-medium py-2 hover:text-pink-500 transition-colors">
            Examples
          </a>
          <a href="#about" className="font-medium py-2 hover:text-pink-500 transition-colors">
            About
          </a>
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-full transition-all">
            Get Started
          </button>
        </div>
      )}
    </header>
  );
}
