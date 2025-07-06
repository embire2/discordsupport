import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export default {
    customId: 'close_ticket',
    
    async execute(interaction) {
        const ticket = interaction.client.db.getTicketByChannel(interaction.channel.id);
        
        if (!ticket || ticket.status !== 'open') {
            return interaction.reply({
                content: '❌ This ticket is already closed or invalid!',
                ephemeral: true
            });
        }

        const settings = interaction.client.db.getSettings(interaction.guild.id);
        
        // Check permissions
        const hasPermission = 
            interaction.user.id === ticket.user_id ||
            interaction.member.roles.cache.has(settings.support_role_id) ||
            interaction.member.roles.cache.has(settings.admin_role_id);

        if (!hasPermission) {
            return interaction.reply({
                content: '❌ You do not have permission to close this ticket!',
                ephemeral: true
            });
        }

        // Confirmation embed
        const confirmEmbed = new EmbedBuilder()
            .setTitle('⚠️ Close Ticket Confirmation')
            .setDescription('Are you sure you want to close this ticket? This action cannot be undone.')
            .setColor('#f59e0b')
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm_close')
                    .setLabel('Confirm Close')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('cancel_close')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({
            embeds: [confirmEmbed],
            components: [row],
            ephemeral: true
        });
    }
};
