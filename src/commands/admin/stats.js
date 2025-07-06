import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View ticket statistics')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const stats = interaction.client.db.getStats(interaction.guild.id);

        const embed = new EmbedBuilder()
            .setTitle('📊 Ticket Statistics')
            .setColor('#9E7FFF')
            .addFields(
                { name: 'Total Tickets', value: stats.totalTickets.toString(), inline: true },
                { name: 'Open Tickets', value: stats.openTickets.toString(), inline: true },
                { name: 'Closed Tickets', value: stats.closedTickets.toString(), inline: true }
            )
            .setTimestamp();

        // Add top users
        if (stats.topUsers.length > 0) {
            let topUsersText = '';
            for (let i = 0; i < stats.topUsers.length; i++) {
                topUsersText += `${i + 1}. <@${stats.topUsers[i].user_id}> - ${stats.topUsers[i].ticket_count} tickets\n`;
            }
            embed.addFields({ name: 'Top Ticket Creators', value: topUsersText, inline: false });
        }

        // Add top support
        if (stats.topSupport.length > 0) {
            let topSupportText = '';
            for (let i = 0; i < stats.topSupport.length; i++) {
                topSupportText += `${i + 1}. <@${stats.topSupport[i].user_id}> - ${stats.topSupport[i].claimed_count} tickets\n`;
            }
            embed.addFields({ name: 'Top Support Staff', value: topSupportText, inline: false });
        }

        await interaction.editReply({ embeds: [embed] });
    }
};
