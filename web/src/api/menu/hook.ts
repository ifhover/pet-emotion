import { menuApi } from "@/api/menu";
import { MenuCreateReq, MenuUpdateReq } from "@/api/menu/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useMenuList() {
  return useQuery({
    queryKey: ["menu_list"],
    queryFn: () => {
      return menuApi.list();
    },
  });
}

export function useMenuSave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MenuCreateReq | MenuUpdateReq) => {
      if ("id" in data && data.id) {
        return menuApi.update(data);
      } else {
        return menuApi.create(data);
      }
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["menu_list"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["menu_self"],
      });
    },
  });
}

export function useMenuDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return menuApi.delete(id);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["menu_list"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["menu_self"],
      });
    },
  });
}

export function useMenu(id?: string) {
  return useQuery({
    queryKey: ["menu_get", id],
    queryFn: () => {
      return menuApi.get(id!);
    },
    enabled: !!id,
  });
}
