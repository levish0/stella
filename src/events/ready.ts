import { Client } from 'discord.js';

export function handleReady(client: Client) {
  client.once('ready', () => {
    console.log('Discord bot is ready! 🤖');
  });
}
