import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DrizzleModule } from './infrastructure/drizzle/drizzle.module';
import { EmailModule } from './infrastructure/email/email.module';
import { MenuModule } from './modules/menu/menu.module';
import { VerifyCodeModule } from './modules/verify-code/verify-code.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './common/guard/auth.guard';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { TurnstileModule } from './infrastructure/turnstile/turnstile.module';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { TaskModule } from './modules/task/task.module';
import { S3Module } from './infrastructure/s3/s3.module';
import { BullModule } from '@nestjs/bullmq';

// 存放业务模块
const modules = [UserModule, MenuModule, VerifyCodeModule, TaskModule];

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    DrizzleModule,
    EmailModule,
    TurnstileModule,
    S3Module,
    ...modules,
  ],
})
export class AppModule {}
