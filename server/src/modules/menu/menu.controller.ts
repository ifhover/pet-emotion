import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Role } from '@/common/decorator/role.decorator';

@Controller('menu')
@Role('admin')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('/create')
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Post('/update/:id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(id, updateMenuDto);
  }

  @Post('/delete/:id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
