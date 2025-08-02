import { REST, Routes } from 'discord.js';
import { config } from './config';
import { commands } from './commands';

export async function deployCommands() {
  const commandsData = Object.values(commands);
  const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, config.DISCORD_GUILD_ID), {
      body: commandsData.map((command) => command.data.toJSON())
    });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}
