import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  phone: text('phone').notNull().unique(),
  password: text('password').notNull(),
  fullName: text('full_name'),
  email: text('email'),
  nid: text('nid'),
  balance: integer('balance').default(0).notNull(),
  role: text('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: text('user_id'),
  amount: integer('amount').notNull(),
  method: text('method').notNull(),
  trxId: text('trx_id').notNull().unique(),
  status: text('status').default('pending').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: text('user_id'),
  serviceId: text('service_id').notNull(),
  serviceName: text('service_name').notNull(),
  price: integer('price').notNull(),
  inputData: text('input_data').notNull(),
  status: text('status').default('pending').notNull(),
  notes: text('notes').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// ✅ সম্পূর্ণ নতুন services table
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  serviceId: text('service_id').notNull().unique(),
  title: text('title').notNull(),
  titleEn: text('title_en').notNull(),
  description: text('description'),
  category: text('category').default('other'),
  icon: text('icon').default('📄'),
  color: text('color').default('bg-gray-100'),
  price: integer('price').default(0),
  popular: boolean('popular').default(false),
  inputLabel: text('input_label'),
  inputPlaceholder: text('input_placeholder'),
  createdAt: timestamp('created_at').defaultNow(),
});