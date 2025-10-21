"use server";
import { cookies } from "next/headers";

export const getServerToken = async () => {
  const cookie = await cookies();
  return cookie.get("token")?.value;
};

export const removeServerToken = async () => {
  const cookie = await cookies();
  cookie.delete("token");
};
