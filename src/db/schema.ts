import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const roleReactions = sqliteTable('role_reactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  messageId: text('message_id').notNull(),
  channelId: text('channel_id').notNull(),
  emoji: text('emoji').notNull(),
  roleId: text('role_id').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP')
});

export const ticketPanels = sqliteTable('ticket_panels', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  messageId: text('message_id').notNull(),
  channelId: text('channel_id').notNull(),
  emoji: text('emoji').notNull(),
  categoryId: text('category_id'),
  ticketName: text('ticket_name').default('ticket'),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP')
});

export const activeTickets = sqliteTable('active_tickets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  channelId: text('channel_id').notNull().unique(),
  userId: text('user_id').notNull(),
  panelId: integer('panel_id').references(() => ticketPanels.id),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP')
});
