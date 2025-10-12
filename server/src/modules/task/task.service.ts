import { Inject, Injectable } from '@nestjs/common';
import { DB_CLIENT, type DbClient } from '../../infrastructure/drizzle/drizzle.types';
import { task } from '@/infrastructure/drizzle/schema';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { S3Service } from '@/infrastructure/s3/s3.service';
import { eq } from 'drizzle-orm';
import { Task } from './entities/task.entities';
import { BusinessError } from '@/common/exception/business-exception';
import sharp from 'sharp';
import { TaskJobDto } from './dto/task-job.dto';
import { TaskCompleteDto } from './dto/task-complete.dto';

@Injectable()
export class TaskService {
  constructor(
    @Inject(DB_CLIENT) private readonly db: DbClient,
    @InjectQueue('task') private readonly taskQueue: Queue<TaskJobDto>,
    private readonly s3Service: S3Service,
  ) {}

  public async create(file: Express.Multer.File) {
    const img = sharp(file.buffer);

    const { url } = await this.s3Service.upload({
      buffer: await img.toBuffer(),
      mimetype: file.mimetype,
      fileType: file.originalname.split('.').at(-1)!,
    });

    const data = (await this.db.insert(task).values({ path: url }).returning())[0];
    await this.taskQueue.add('pet-task', {
      id: data.id,
      mimeType: file.mimetype,
      base64ImageData: (await img.toBuffer()).toString('base64'),
    });

    return {
      id: data.id,
    };
  }

  public async get(id: string): Promise<Task> {
    const data = await this.db.query.task.findFirst({
      where: eq(task.id, id),
    });
    if (!data) {
      throw new BusinessError('Task not found');
    }
    return data;
  }

  public async complete(dto: TaskCompleteDto) {
    await this.db.update(task).set(dto).where(eq(task.id, dto.id)).execute();
  }
}
