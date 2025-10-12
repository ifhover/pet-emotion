import {
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  Sse,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { TaskConsumer } from './task.consumer';
import { Public } from '@/common/decorator/public.decoratot';

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
  ) {
    return this.taskService.create(file);
  }

  @Get(':id')
  @Public()
  public async get(@Param('id') id: string) {
    return this.taskService.get(id);
  }

  @Sse('sse/:id')
  @Public()
  public async sse(@Param('id') id: string) {
    return this.taskConsumer.sse(id);
  }
}
