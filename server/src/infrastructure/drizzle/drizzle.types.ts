import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export type DbClient = NodePgDatabase<typeof schema>;

export const DB_CLIENT = 'DB_CLIENT';
