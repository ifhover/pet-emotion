import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { v7 } from 'uuid';
import { VerifyCodeBizType, VerifyCodeChannel } from '@/common/type/dict';
import { TaskStatus } from '@/common/type/dict';
import { integer } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  email: text(),
  password: text(),
  google_id: text(),
  role: text().notNull().default('user'),
  gen_limit: integer().notNull().default(5),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const userRelations = relations(user, ({ many }) => ({
  tokens: many(token),
  tasks: many(task),
}));

export const token = pgTable('token', {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  user_id: uuid(),
  token: text().notNull(),
  expired_at: timestamp({ withTimezone: true }).notNull(),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const tokenRelations = relations(token, ({ one }) => ({
  user: one(user, {
    fields: [token.user_id],
    references: [user.id],
  }),
}));

export const verifyCode = pgTable('verify_code', {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  channel: text().notNull().$type<VerifyCodeChannel>(),
  receiver: text().notNull(),
  biz_type: text().notNull().$type<VerifyCodeBizType>(),
  code: text().notNull(),
  expired_at: timestamp({ withTimezone: true }).notNull(),
  used_at: timestamp({ withTimezone: true }),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const menu = pgTable('menu', {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  pid: uuid(),
  name: text().notNull(),
  path: text().notNull(),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const task = pgTable('task', {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  path: text().notNull(),
  status: text()
    .notNull()
    .$type<TaskStatus>()
    .$default(() => TaskStatus.Processing),
  error_message: text(),
  result: text(),
  user_id: text(),
  ip: text(),
  grade: integer().default(0),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

const taskRelations = relations(task, ({ one }) => ({
  user: one(user, {
    fields: [task.user_id],
    references: [user.id],
  }),
}));
