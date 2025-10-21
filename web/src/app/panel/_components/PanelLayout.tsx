"use client";

import { App, Dropdown, Menu, MenuProps } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Layout } from "antd";
import { JSX, useMemo, useState } from "react";
import { FaIndent, FaOutdent } from "react-icons/fa6";
import { Avatar } from "antd";
import { FaUser } from "react-icons/fa6";
import { MenuTree } from "@/api/menu/type";
import { useUserMyDetail } from "@/api/user/hook";
import jsCookie from "js-cookie";
import { useMenuList } from "@/api/menu/hook";

function MenuIcon(props: { data: MenuTree }): JSX.Element | undefined {
  return undefined;
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const { data: userInfo } = useUserMyDetail();
  const { data: selfMenus } = useMenuList();

  const { modal } = App.useApp();

  const menus: MenuProps["items"] = useMemo(() => {
    function recurse(menus: MenuTree[]): MenuProps["items"] {
      return menus.map((menu) => {
        return {
          key: menu.path,
          icon: <MenuIcon data={menu} />,
          label: menu.children ? menu.name : <Link href={menu.path}>{menu.name}</Link>,
          children: menu.children ? recurse(menu.children) : undefined,
        };
      });
    }
    return recurse(selfMenus || []);
  }, [selfMenus]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 左侧菜单 */}
      <Layout.Sider trigger={null} collapsible collapsed={collapsed} width={240}>
        <div className="px-2">
          <div className="text-white h-15 flex items-center justify-center text-2xl font-bold mb-2 overflow-hidden whitespace-nowrap">
            {collapsed ? "P" : "Pet"}
          </div>
          <Menu theme="dark" mode="inline" selectedKeys={[pathname]} items={menus} />
        </div>
      </Layout.Sider>
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="h-15 shadow-2xs bg-white flex items-center justify-between w-full px-4">
          <div className="flex items-center gap-2">
            <div
              className="w-[32px] h-[32px] flex items-center justify-center text-[15px] rounded-md hover:bg-gray-200 cursor-pointer transition-all bg-gray-100"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <FaIndent /> : <FaOutdent />}
            </div>
          </div>
          <Dropdown
            menu={{
              items: [
                {
                  label: "退出登录",
                  key: "logout",
                  onClick: () => {
                    modal.confirm({
                      title: "退出登录",
                      content: "确定退出登录吗？",
                      onOk: () => {
                        jsCookie.remove("token");
                        router.push("/auth/login");
                      },
                    });
                  },
                },
              ],
            }}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar icon={<FaUser />} className="mr-1 bg-primary-400 text-white text-[14px]" />
              <span className="text-sm text-gray-800">{userInfo?.email}</span>
            </div>
          </Dropdown>
        </div>
        <div className="flex-1 overflow-auto relative">{children}</div>
      </div>
    </div>
  );
}
