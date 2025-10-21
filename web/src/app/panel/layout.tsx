import { userApi } from "@/api/user";
import PanelLayout from "./_components/PanelLayout";
import { notFound, redirect } from "next/navigation";

export default async function ({ children }: { children: React.ReactNode }) {
  const user = await userApi.my_detail();
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "admin") {
    notFound();
  }
  return <PanelLayout>{children}</PanelLayout>;
}
