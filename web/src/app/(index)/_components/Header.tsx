"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PetButton from "./PetButton";
import Logo from "@/components/Logo";
import { useUserMyDetail } from "@/api/user/hook";
import { Dropdown, Spin } from "antd";
import jsCookie from "js-cookie";
import { useRouter } from "next/navigation";
import { useTaskGenLimit } from "@/api/task/hook";
import { removeToken } from "@/utils/request";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  // 监听滚动事件，用于导航栏样式变化
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: user, refetch: refetchUser, isPending: loadingUser, status } = useUserMyDetail();
  const { data: limit, isPending: loadingLimit } = useTaskGenLimit();

  useEffect(() => {
    if (status === "success" && !user) {
      removeToken();
    }
  }, [user]);

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
          <Logo />

          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center space-x-8 ">
            <Link href="/" className=" font-medium transition-colors text-neutral-700">
              首页
            </Link>
            <Link href="/record" className="font-medium  transition-colors text-neutral-700">
              分析记录
            </Link>
            <Spin spinning={loadingUser} size="small">
              {user ? (
                <Dropdown
                  menu={{
                    items: [{ label: "退出登录", key: "logout" }],
                    onClick: ({ key }) => {
                      if (key === "logout") {
                        jsCookie.remove("token");
                        refetchUser();
                      }
                    },
                  }}
                >
                  <div className="flex items-center cursor-pointer">
                    <div className="text-xl mr-2 size-9 bg-primary-300 rounded-xl flex justify-center items-center">
                      🐼
                    </div>
                    <div>
                      <div className="text-sm">已登录</div>
                      <div className="text-xs text-gray-500">剩余次数: {limit}</div>
                    </div>
                  </div>
                </Dropdown>
              ) : (
                <>
                  <Link className="mr-5!" href="/log-in">
                    <PetButton type="primary">登录</PetButton>
                  </Link>

                  <Link href="/sign-up">
                    <PetButton type="normal">注册</PetButton>
                  </Link>
                </>
              )}
            </Spin>
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
