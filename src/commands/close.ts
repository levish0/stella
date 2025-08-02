import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getActiveTicket, removeActiveTicket } from '../database';

export const data = new SlashCommandBuilder().setName('close').setDescription('현재 티켓을 닫습니다');

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    return interaction.reply({ content: '서버에서만 사용할 수 있습니다.', ephemeral: true });
  }

  try {
    const activeTicket = getActiveTicket(interaction.channelId);

    if (!activeTicket) {
      return interaction.reply({ content: '이 채널은 티켓이 아닙니다.', ephemeral: true });
    }

    if (activeTicket.userId !== interaction.user.id && !interaction.memberPermissions?.has('ManageChannels')) {
      return interaction.reply({ content: '티켓 소유자이거나 채널 관리 권한이 있어야 합니다.', ephemeral: true });
    }

    await interaction.reply('티켓을 닫는 중...');

    removeActiveTicket(interaction.channelId);

    setTimeout(async () => {
      await interaction.channel?.delete();
    }, 3000);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '오류가 발생했습니다.', ephemeral: true });
  }
}
