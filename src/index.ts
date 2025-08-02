import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from './config';
import { commands } from './commands';
import { deployCommands } from './deploy-commands';
import { setupEvents } from './events';
import { initDatabase } from './database';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ]
});

(client as any).commands = new Collection();

const commandsData = Object.values(commands);
for (const command of commandsData) {
  (client as any).commands.set(command.data.name, command);
}

async function start() {
  initDatabase();
  await deployCommands();
  setupEvents(client);
  await client.login(config.DISCORD_TOKEN);
}

start().catch(console.error);
