"use client";
import { useUserMyDetail } from "@/api/user/hook";
import PetButton from "../_components/PetButton";
import Link from "next/link";
import PetRecord from "./_components/PetRecord";
import { Spin } from "antd";

export default function RecordPage() {
  const { data: user, isPending: isPendingUser } = useUserMyDetail();
  return (
    <div className="min-h-screen bg-gradient-to-br from-transparent to-primary-100">
      <div className="container mx-auto pt-32 px-4 md:px-0">
        <Spin spinning={isPendingUser}>
          {user ? (
            <PetRecord />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-2xl font-bold mb-6">登陆后可记录和查看分析记录</div>
              <Link href="/log-in">
                <PetButton>去登录</PetButton>
              </Link>
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
}
