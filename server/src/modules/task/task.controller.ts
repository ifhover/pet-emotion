import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  Req,
  Sse,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { TaskConsumer } from './task.consumer';
import { Public } from '@/common/decorator/public.decorator';
import type { UserEntities } from '../user/entities/user.entities';
import { FromUser } from '@/common/decorator/user.decorator';
import { Role } from '@/common/decorator/role.decorator';
import { TaskFindAllDto } from './dto/task-find-all.dto';
import { TaskUpdateDto } from './dto/task-update.dto';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskConsumer: TaskConsumer,
  ) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  @Public()
  public async create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /jpg|jpeg|png/, skipMagicNumbersValidation: true })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 5 })
        .build(),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.taskService.create(file, req);
  }

  @Get('/info/:id')
  @Public()
  public async get(@Param('id') id: string) {
    return this.taskService.get(id);
  }

  @Sse('sse/:id')
  @Public()
  public async sse(@Param('id') id: string) {
    return this.taskConsumer.sse(id);
  }

  @Get('gen-limit')
  @Public()
  public async getGenLimit(@Req() req: Request) {
    return this.taskService.getGenLimit(req);
  }

  @Get('my-records')
  public async myRecords(@FromUser() user: UserEntities) {
    return this.taskService.myRecords(user.id);
  }

  @Get()
  @Role('admin')
  public async findAll(@Query() dto: TaskFindAllDto) {
    return this.taskService.findAll(dto);
  }

  @Post('update/:id')
  @Role('admin')
  public async update(@Param('id') id: string, @Body() dto: TaskUpdateDto) {
    return this.taskService.update(id, dto);
  }
}
