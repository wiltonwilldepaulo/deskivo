import { pgTable, text, varchar, timestamp, bigserial } from 'drizzle-orm/pg-core';

export const customer = pgTable('customer', {
	id: bigserial('id').primaryKey(),
	nome: text('name', { length: 150 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});