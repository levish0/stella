import { Client } from 'discord.js';
import { handleReady } from './ready';
import { handleInteractionCreate } from './interactionCreate';
import { handleMessageCreate } from './messageCreate';
import { handleMessageReactionAdd } from './messageReactionAdd';

export function setupEvents(client: Client) {
  handleReady(client);
  handleInteractionCreate(client);
  handleMessageCreate(client);
  handleMessageReactionAdd(client);
}
