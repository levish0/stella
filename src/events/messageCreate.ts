import { Client, Message } from 'discord.js';

export function handleMessageCreate(client: Client) {
  client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return;

    const botMention = `<@${client.user?.id}>`;
    const botMentionNick = `<@!${client.user?.id}>`;

    if (!message.content.startsWith(botMention) && !message.content.startsWith(botMentionNick)) return;

    const args = message.content.replace(botMention, '').replace(botMentionNick, '').trim().split(/ +/);

    const commandName = args.shift()?.toLowerCase();

    if (!commandName) {
      await message.reply('명령어를 입력해주세요! 예: ping');
      return;
    }

    const command = (client as any).commands.get(commandName);

    if (!command) {
      await message.reply(`\`${commandName}\` 명령어를 찾을 수 없습니다.`);
      return;
    }

    try {
      const fakeInteraction = {
        reply: async (content: string) => {
          await message.reply(content);
        },
        user: message.author,
        guild: message.guild,
        channel: message.channel,
        commandName: commandName,
        options: {
          getString: () => null,
          getUser: () => null,
          getChannel: () => null
        }
      };

      await command.execute(fakeInteraction);
    } catch (error) {
      console.error(error);
      await message.reply('명령어 실행 중 오류가 발생했습니다.');
    }
  });
}
