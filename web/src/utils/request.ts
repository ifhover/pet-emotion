import JsCookie from "js-cookie";
import { getServerToken, removeServerToken } from "./token";
import qs from "qs";
import { antdHelper } from "./antd-helper";

export async function getToken() {
  if (typeof window === "undefined") {
    return getServerToken();
  }
  return JsCookie.get("token");
}

export async function removeToken() {
  if (typeof window === "undefined") {
    await removeServerToken();
  }
  JsCookie.remove("token");
}

export type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: Record<string, any> | RequestInit["body"];
  headers?: Record<string, string>;
};

// 实现体
async function _request<T>(url: string, options?: RequestOptions): Promise<T> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";
  let headers: Record<string, string> = {};

  const token = await getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let body = options?.body;
  if (options?.body && Object.prototype.toString.call(options?.body) === "[object Object]") {
    body = JSON.stringify(options?.body);
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${baseURL}${url}`, {
    ...options,
    headers,
    body: body as RequestInit["body"],
  });

  if (!res.ok) {
    let msg = res.statusText;
    if (res.headers.get("Content-Type")?.includes("application/json")) {
      const { message } = await res.json();
      if (message) {
        msg = message;
      }
    }
    antdHelper.message?.error(msg);
    throw new Error(msg);
  }

  if (res.headers.get("Content-Type")?.includes("application/json")) {
    return (await res.json()) as T;
  }
  return res as T;
}

export const request = {
  get: <T>(url: string, data?: Record<string, any>, options?: Omit<RequestOptions, "method">) => {
    return _request<T>(`${url}?${qs.stringify(data)}`, { ...options, method: "GET" });
  },
  post: <T>(url: string, body?: Record<string, any> | FormData, options?: Omit<RequestOptions, "method">) => {
    return _request<T>(url, {
      ...options,
      method: "POST",
      body: body,
    });
  },
};
