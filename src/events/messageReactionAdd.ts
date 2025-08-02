import { Client, MessageReaction, User, ChannelType, PermissionFlagsBits } from 'discord.js';
import { getRoleReaction, getTicketPanel, addActiveTicket, db } from '../database';
import { activeTickets } from '../db/schema';
import { eq } from 'drizzle-orm';

export function handleMessageReactionAdd(client: Client) {
  client.on('messageReactionAdd', async (reaction: MessageReaction, user: User) => {
    if (user.bot) return;

    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('반응을 가져오는 중 오류:', error);
        return;
      }
    }

    const messageId = reaction.message.id;
    const emoji = reaction.emoji.name || reaction.emoji.toString();

    try {
      const roleReaction = getRoleReaction(messageId, emoji);
      if (roleReaction) {
        const guild = reaction.message.guild;
        const member = await guild?.members.fetch(user.id);
        const role = guild?.roles.cache.get(roleReaction.role_id);

        if (member && role) {
          await member.roles.add(role);
          try {
            await user.send(`${guild?.name}에서 ${role.name} 역할이 부여되었습니다!`);
          } catch (error) {
            console.log('DM 전송 실패:', error);
          }
        }
        return;
      }

      const ticketPanel = getTicketPanel(messageId, emoji);
      if (ticketPanel) {
        const guild = reaction.message.guild;
        if (!guild) return;

        const existingTickets = db.select().from(activeTickets)
          .where(eq(activeTickets.userId, user.id)).all();
        
        if (existingTickets.length > 0) {
          try {
            await user.send('이미 열린 티켓이 있습니다!');
          } catch (error) {
            console.log('DM 전송 실패:', error);
          }
          return;
        }

        const ticketChannel = await guild.channels.create({
          name: `${ticketPanel.ticket_name}-${user.username}`,
          type: ChannelType.GuildText,
          parent: ticketPanel.category_id || undefined,
          permissionOverwrites: [
            {
              id: guild.id,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: user.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
          ],
        });

        addActiveTicket(ticketChannel.id, user.id, ticketPanel.id);

        await ticketChannel.send({
          content: `안녕하세요 ${user}님! 티켓이 생성되었습니다.\n\n티켓을 닫으려면 \`/close\` 명령어를 사용하세요.`
        });

        try {
          await user.send(`티켓이 생성되었습니다: ${ticketChannel}`);
        } catch (error) {
          console.log('DM 전송 실패:', error);
        }

        await reaction.users.remove(user);
      }
    } catch (error) {
      console.error('반응 처리 중 오류:', error);
    }
  });
}