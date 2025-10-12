import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import type { DbClient } from '@/infrastructure/drizzle/drizzle.types';
import { DB_CLIENT } from '@/infrastructure/drizzle/drizzle.types';
import { menu } from '@/infrastructure/drizzle/schema';
import { Menu } from './entities/menu.entity';
import { MenuTree } from './entities/menu-tree.entity';
import { eq } from 'drizzle-orm';

@Injectable()
export class MenuService {
  public constructor(@Inject(DB_CLIENT) private readonly db: DbClient) {}

  async create(createMenuDto: CreateMenuDto) {
    return (await this.db.insert(menu).values(createMenuDto).returning())[0];
  }

  async findAll() {
    const list = await this.db.query.menu.findMany();
    const map = new Map<string, Menu[]>();

    list.forEach((item) => {
      let pid = item.pid || '';
      map.set(pid, [...(map.get(pid) || []), item]);
    });

    function recurse(list: Menu[]): MenuTree[] {
      return list.map((item) => {
        let children = recurse(map.get(item.id) || []);
        if (children.length > 0 && children[0].pid === item.pid) {
          return { ...item, children: undefined };
        }
        return {
          ...item,
          children: children.length > 0 ? children : undefined,
        };
      });
    }

    return recurse(map.get('') || []);
  }

  async findOne(id: string) {
    return await this.db.query.menu.findFirst({
      where: eq(menu.id, id),
    });
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    return await this.db.update(menu).set(updateMenuDto).where(eq(menu.id, id)).returning()[0];
  }

  async remove(id: string) {
    await this.db.delete(menu).where(eq(menu.id, id));
  }
}
