import { Inject, Injectable } from '@nestjs/common';
import { DB_CLIENT, type DbClient } from '../../infrastructure/drizzle/drizzle.types';
import { task } from '@/infrastructure/drizzle/schema';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { S3Service } from '@/infrastructure/s3/s3.service';
import { eq, and, inArray, gt, desc, sql } from 'drizzle-orm';
import { TaskEntities } from './entities/task.entities';
import { BusinessError } from '@/common/exception/business-exception';
import sharp from 'sharp';
import { TaskJobDto } from './dto/task-job.dto';
import { TaskCompleteDto } from './dto/task-complete.dto';
import { UserService } from '../user/user.service';
import { TaskStatus } from '@/common/type/dict';
import dayjs from 'dayjs';
import { TaskFindAllDto } from './dto/task-find-all.dto';
import { PageData } from '@/common/type/common';
import { TaskUpdateDto } from './dto/task-update.dto';

@Injectable()
export class TaskService {
  constructor(
    @Inject(DB_CLIENT) private readonly db: DbClient,
    @InjectQueue('task') private readonly taskQueue: Queue<TaskJobDto>,
    private readonly s3Service: S3Service,
    private readonly userService: UserService,
  ) {}

  public async create(file: Express.Multer.File, req: Request) {
    const user = await this.userService.getByRequest(req);
    const genLimitCount = await this.getGenLimit(req);

    if (genLimitCount <= 0) {
      throw new BusinessError('Gen limit exceeded');
    }

    const img = sharp(file.buffer);

    const { url } = await this.s3Service.upload({
      buffer: await img.toBuffer(),
      mimetype: file.mimetype,
      fileType: file.originalname.split('.').at(-1)!,
    });

    const data = (
      await this.db
        .insert(task)
        .values({ path: url, user_id: user?.id ?? null, ip: req['ip'] as undefined | string })
        .returning()
    )[0];
    await this.taskQueue.add('pet-task', {
      id: data.id,
      url,
    });

    return {
      id: data.id,
    };
  }

  public async get(id: string): Promise<TaskEntities> {
    const data = await this.db.query.task.findFirst({
      where: eq(task.id, id),
    });
    if (!data) {
      throw new BusinessError('Task not found');
    }
    return data;
  }

  public async complete(dto: TaskCompleteDto) {
    await this.db.update(task).set(dto).where(eq(task.id, dto.id));
  }

  public async getGenLimit(req: Request) {
    let count = 0;
    const user = await this.userService.getByRequest(req);
    if (user) {
      count =
        count +
        user.gen_limit -
        (await this.db.$count(
          task,
          and(
            eq(task.user_id, user.id),
            inArray(task.status, [TaskStatus.Ok, TaskStatus.Processing]),
            gt(task.created_at, dayjs().startOf('day').toDate()),
          ),
        ));
    }
    const ip = req['ip'] as undefined | string;
    if (ip) {
      count =
        count +
        Math.max(
          0,
          3 -
            (await this.db.$count(
              task,
              and(
                eq(task.ip, ip),
                inArray(task.status, [TaskStatus.Ok, TaskStatus.Processing]),
                gt(task.created_at, dayjs().startOf('day').toDate()),
              ),
            )),
        );
    }
    return count;
  }

  public async myRecords(user_id: string): Promise<TaskEntities[]> {
    const data = await this.db.query.task.findMany({
      where: and(eq(task.user_id, user_id), eq(task.status, TaskStatus.Ok)),
      orderBy: desc(task.created_at),
    });
    return data;
  }

  public async findAll(dto: TaskFindAllDto): Promise<PageData<TaskEntities>> {
    const pageSize = Number(dto.page_size);
    const pageIndex = Number(dto.page_index);
    const list = await this.db
      .select()
      .from(task)
      .where(
        and(
          dto.status ? eq(task.status, dto.status) : undefined,
          dto.grade ? eq(task.grade, dto.grade) : undefined,
        ),
      )
      .orderBy(desc(task.created_at))
      .limit(pageSize)
      .offset((pageIndex - 1) * pageSize);

    const total = await this.db.$count(
      task,
      and(
        dto.status ? eq(task.status, dto.status) : undefined,
        dto.grade ? eq(task.grade, dto.grade) : undefined,
      ),
    );

    return {
      list,
      total,
      page_index: pageIndex,
      page_size: pageSize,
    };
  }

  public async update(id: string, dto: TaskUpdateDto) {
    await this.db.update(task).set(dto).where(eq(task.id, id));
  }

  public async indexCases() {
    return {
      top: await this.db.query.task.findFirst({
        where: and(eq(task.status, TaskStatus.Ok), eq(task.grade, 2)),
        orderBy: desc(task.created_at),
      }),
      bottom_list: await this.db.query.task.findMany({
        where: and(eq(task.status, TaskStatus.Ok), eq(task.grade, 1)),
        orderBy: desc(task.created_at),
        limit: 4,
      }),
    };
  }
}
