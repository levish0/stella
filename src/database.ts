import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { eq, and } from 'drizzle-orm';
import { roleReactions, ticketPanels, activeTickets } from './db/schema';

const sqlite = new Database('./data.db');
export const db = drizzle(sqlite);

export function initDatabase() {
  try {
    migrate(db, { migrationsFolder: './drizzle' });
  } catch (error) {
    console.log('No migrations to run or migration failed:', error);
    // Fallback to manual table creation
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS role_reactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id TEXT NOT NULL,
        channel_id TEXT NOT NULL,
        emoji TEXT NOT NULL,
        role_id TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS ticket_panels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message_id TEXT NOT NULL,
        channel_id TEXT NOT NULL,
        emoji TEXT NOT NULL,
        category_id TEXT,
        ticket_name TEXT DEFAULT 'ticket',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS active_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channel_id TEXT NOT NULL UNIQUE,
        user_id TEXT NOT NULL,
        panel_id INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
}

export function addRoleReaction(messageId: string, channelId: string, emoji: string, roleId: string) {
  db.insert(roleReactions)
    .values({
      messageId,
      channelId,
      emoji,
      roleId
    })
    .run();
}

export function getRoleReaction(messageId: string, emoji: string) {
  const result = db
    .select()
    .from(roleReactions)
    .where(and(eq(roleReactions.messageId, messageId), eq(roleReactions.emoji, emoji)))
    .all();
  return result[0];
}

export function addTicketPanel(
  messageId: string,
  channelId: string,
  emoji: string,
  categoryId?: string,
  ticketName?: string
) {
  db.insert(ticketPanels)
    .values({
      messageId,
      channelId,
      emoji,
      categoryId,
      ticketName: ticketName || 'ticket'
    })
    .run();
}

export function getTicketPanel(messageId: string, emoji: string) {
  const result = db
    .select()
    .from(ticketPanels)
    .where(and(eq(ticketPanels.messageId, messageId), eq(ticketPanels.emoji, emoji)))
    .all();
  return result[0];
}

export function addActiveTicket(channelId: string, userId: string, panelId: number) {
  db.insert(activeTickets)
    .values({
      channelId,
      userId,
      panelId
    })
    .run();
}

export function getActiveTicket(channelId: string) {
  const result = db.select().from(activeTickets).where(eq(activeTickets.channelId, channelId)).all();
  return result[0];
}

export function removeActiveTicket(channelId: string) {
  db.delete(activeTickets).where(eq(activeTickets.channelId, channelId)).run();
}
