import { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    customId: 'ticket_category',
    
    async execute(interaction) {
        await interaction.deferUpdate();
        
        const category = interaction.values[0];
        const settings = interaction.client.db.getSettings(interaction.guild.id);
        
        if (!settings.ticket_category_id) {
            return interaction.followUp({
                content: '❌ Ticket system is not properly configured! Please contact an administrator.',
                ephemeral: true
            });
        }

        // Generate ticket ID
        const ticketNumber = interaction.client.db.incrementTicketCounter(interaction.guild.id);
        const ticketId = `ticket-${ticketNumber.toString().padStart(4, '0')}`;

        // Create ticket channel
        const ticketChannel = await interaction.guild.channels.create({
            name: ticketId,
            type: ChannelType.GuildText,
            parent: settings.ticket_category_id,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.AttachFiles
                    ]
                },
                {
                    id: settings.support_role_id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.ManageMessages
                    ]
                }
            ]
        });

        // Create ticket in database
        interaction.client.db.createTicket(ticketId, ticketChannel.id, interaction.user.id, category);

        // Create welcome embed
        const welcomeEmbed = new EmbedBuilder()
            .setTitle(`🎫 ${ticketId}`)
            .setDescription(settings.welcome_message || `Hello ${interaction.user}! Thank you for creating a ticket.\n\nA member of our support team will be with you shortly. Please describe your issue in detail below.`)
            .addFields(
                { name: 'Category', value: category.charAt(0).toUpperCase() + category.slice(1), inline: true },
                { name: 'Created by', value: interaction.user.tag, inline: true },
                { name: 'Status', value: '🟢 Open', inline: true }
            )
            .setColor('#9E7FFF')
            .setTimestamp();

        const controlRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Close Ticket')
                    .setEmoji('🔒')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('claim_ticket')
                    .setLabel('Claim Ticket')
                    .setEmoji('🎯')
                    .setStyle(ButtonStyle.Primary)
            );

        await ticketChannel.send({
            content: `${interaction.user} | <@&${settings.support_role_id}>`,
            embeds: [welcomeEmbed],
            components: [controlRow]
        });

        // Log ticket creation
        const logChannel = interaction.guild.channels.cache.get(settings.log_channel_id);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setTitle('New Ticket Created')
                .setColor('#10b981')
                .addFields(
                    { name: 'Ticket', value: ticketId, inline: true },
                    { name: 'User', value: interaction.user.tag, inline: true },
                    { name: 'Category', value: category, inline: true }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [logEmbed] });
        }

        await interaction.editReply({
            content: `✅ Your ticket has been created! ${ticketChannel}`,
            components: []
        });
    }
};
