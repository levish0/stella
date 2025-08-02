import { Client } from 'discord.js';
import { handleReady } from './ready';
import { handleInteractionCreate } from './interactionCreate';

export function setupEvents(client: Client) {
  handleReady(client);
  handleInteractionCreate(client);
}
