import { request } from "@/utils/request";
import { Menu } from "./type";
import { MenuCreateReq, MenuTree, MenuUpdateReq } from "./type";

export const menuApi = {
  list: () => request.get<MenuTree[]>("/menu"),

  create: (data: MenuCreateReq) => request.post<Menu>("/menu/create", data),

  update: (data: MenuUpdateReq) => request.post<Menu>(`/menu/update/${data.id}`, data),

  delete: (id: string) => request.post(`/menu/delete/${id}`),

  get: (id: string) => request.get(`/menu/${id}`),
};
