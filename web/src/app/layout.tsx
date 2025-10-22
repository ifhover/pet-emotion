import type { Metadata } from "next";
import "./globals.css";
import { AntdNextRegistry } from "@/components/systeam/AntdNextRegistry";
import { useMemo } from "react";
import color from "color";
import { AppFuncInject } from "@/utils/antd-helper";
import { QueryRegistry } from "@/components/systeam/QueryRegistry";

export const metadata: Metadata = {
  title: "PetEmotionAI",
  description: "了解你的宠物情绪",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const colorPrimary = "#e82e72";
  const style = useMemo(() => {
    return {
      "--color-primary-50": color(colorPrimary).lighten(0.7).hex(),
      "--color-primary-100": color(colorPrimary).lighten(0.6).hex(),
      "--color-primary-200": color(colorPrimary).lighten(0.5).hex(),
      "--color-primary-300": color(colorPrimary).lighten(0.4).hex(),
      "--color-primary-400": color(colorPrimary).lighten(0.2).hex(),
      "--color-primary-500": color(colorPrimary).lighten(0).hex(),
      "--color-primary-600": color(colorPrimary).darken(0.1).hex(),
      "--color-primary-700": color(colorPrimary).darken(0.2).hex(),
      "--color-primary-800": color(colorPrimary).darken(0.3).hex(),
      "--color-primary-900": color(colorPrimary).darken(0.4).hex(),
    };
  }, [colorPrimary]);

  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body style={style as React.CSSProperties}>
        <QueryRegistry>
          <AntdNextRegistry colorPrimary={colorPrimary}>
            <AppFuncInject />
            {children}
          </AntdNextRegistry>
        </QueryRegistry>
      </body>
    </html>
  );
}
