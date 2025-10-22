"use client";

import { App, message } from "antd";
import { useEffect } from "react";
import Cookies from "js-cookie";

export const antdHelper: {
  message?: ReturnType<typeof App.useApp>["message"];
} = {
  message,
};

export function AppFuncInject() {
  const app = App.useApp();
  useEffect(() => {
    antdHelper.message = app.message;
  }, []);

  return null;
}
