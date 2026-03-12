import { text } from 'drizzle-orm/gel-core';
import { pgTable, uuid, varchar, timestamp, bigserial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 150 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const customer = pgTable('customer', {
    id: bigserial('id').primaryKey(),
    nome: text('name', { length: 150 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});