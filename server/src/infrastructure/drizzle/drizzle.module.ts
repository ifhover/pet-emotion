import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DB_CLIENT } from '@/infrastructure/drizzle/drizzle.types';
import * as schema from '@/infrastructure/drizzle/schema';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: DB_CLIENT,
      useFactory: (configService: ConfigService) => {
        return drizzle(configService.get('DB_URL'), { schema });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DB_CLIENT],
})
export class DrizzleModule {}
