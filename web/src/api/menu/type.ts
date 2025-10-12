export type Menu = {
  id: string;
  name: string;
  path: string;
  pid: string;
};

export type MenuTree = Menu & {
  children: MenuTree[];
};

export type MenuCreateReq = Omit<Menu, "id">;

export type MenuUpdateReq = Menu;
