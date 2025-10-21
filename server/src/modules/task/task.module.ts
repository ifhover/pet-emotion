import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { BullModule } from '@nestjs/bullmq';
import { TaskConsumer } from './task.consumer';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'task',
    }),
    UserModule,
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskConsumer],
})
export class TaskModule {}
