import { Menu } from './menu.entity';

export class MenuTree extends Menu {
  public children: MenuTree[] | undefined;
}
