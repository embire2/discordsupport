import { EmbedBuilder } from 'discord.js';

export default {
    customId: 'claim_ticket',
    
    async execute(interaction) {
        const ticket = interaction.client.db.getTicketByChannel(interaction.channel.id);
        const settings = interaction.client.db.getSettings(interaction.guild.id);

        if (!interaction.member.roles.cache.has(settings.support_role_id) && 
            !interaction.member.roles.cache.has(settings.admin_role_id)) {
            return interaction.reply({
                content: '❌ Only support staff can claim tickets!',
                ephemeral: true
            });
        }

        if (ticket.claimed_by) {
            return interaction.reply({
                content: '❌ This ticket has already been claimed!',
                ephemeral: true
            });
        }

        interaction.client.db.claimTicket(ticket.ticket_id, interaction.user.id);

        const embed = new EmbedBuilder()
            .setDescription(`🎯 Ticket claimed by ${interaction.user}`)
            .setColor('#9E7FFF');

        await interaction.reply({ embeds: [embed] });

        // Update channel name
        await interaction.channel.setName(`${ticket.ticket_id}-${interaction.user.username}`);
    }
};
