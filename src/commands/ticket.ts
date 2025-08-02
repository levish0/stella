import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { addTicketPanel } from '../database';

export const data = new SlashCommandBuilder()
  .setName('ticket')
  .setDescription('티켓 패널을 설정합니다')
  .addStringOption(option =>
    option.setName('message_id')
      .setDescription('메시지 ID')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('emoji')
      .setDescription('이모지 (예: 🎫 또는 :ticket:)')
      .setRequired(true))
  .addChannelOption(option =>
    option.setName('category')
      .setDescription('티켓이 생성될 카테고리')
      .setRequired(false))
  .addStringOption(option =>
    option.setName('ticket_name')
      .setDescription('티켓 채널 이름 (기본값: ticket)')
      .setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    return interaction.reply({ content: '서버에서만 사용할 수 있습니다.', ephemeral: true });
  }

  const messageId = interaction.options.getString('message_id', true);
  const emoji = interaction.options.getString('emoji', true);
  const category = interaction.options.getChannel('category');
  const ticketName = interaction.options.getString('ticket_name') || 'ticket';

  try {
    const message = await interaction.channel?.messages.fetch(messageId);
    if (!message) {
      return interaction.reply({ content: '메시지를 찾을 수 없습니다.', ephemeral: true });
    }

    addTicketPanel(messageId, interaction.channelId, emoji, category?.id, ticketName);
    await message.react(emoji);

    await interaction.reply({ 
      content: `메시지에 ${emoji} 티켓 반응을 추가했습니다. 이 이모지를 누르면 티켓이 생성됩니다.`,
      ephemeral: true 
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '오류가 발생했습니다.', ephemeral: true });
  }
}