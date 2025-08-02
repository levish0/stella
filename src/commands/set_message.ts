import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { addRoleReaction } from '../database';

export const data = new SlashCommandBuilder()
  .setName('set_message')
  .setDescription('특정 메시지에 역할 반응을 설정합니다')
  .addStringOption(option =>
    option.setName('message_id')
      .setDescription('메시지 ID')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('emoji')
      .setDescription('이모지 (예: 🎮 또는 :custom_emoji:)')
      .setRequired(true))
  .addRoleOption(option =>
    option.setName('role')
      .setDescription('부여할 역할')
      .setRequired(true))
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    return interaction.reply({ content: '서버에서만 사용할 수 있습니다.', ephemeral: true });
  }

  const messageId = interaction.options.getString('message_id', true);
  const emoji = interaction.options.getString('emoji', true);
  const role = interaction.options.getRole('role', true);

  if (!role) {
    return interaction.reply({ content: '역할을 찾을 수 없습니다.', ephemeral: true });
  }

  try {
    const message = await interaction.channel?.messages.fetch(messageId);
    if (!message) {
      return interaction.reply({ content: '메시지를 찾을 수 없습니다.', ephemeral: true });
    }

    addRoleReaction(messageId, interaction.channelId, emoji, role.id);
    await message.react(emoji);

    await interaction.reply({ 
      content: `메시지에 ${emoji} 반응을 추가했습니다. 이 이모지를 누르면 ${role.name} 역할이 부여됩니다.`,
      ephemeral: true 
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '오류가 발생했습니다.', ephemeral: true });
  }
}