import { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';

export default {
    customId: 'create_ticket',
    
    async execute(interaction) {
        // Check if user is blacklisted
        const blacklistEntry = interaction.client.db.isBlacklisted(interaction.user.id);
        if (blacklistEntry) {
            return interaction.reply({
                content: `❌ You are blacklisted from creating tickets.\n**Reason:** ${blacklistEntry.reason}`,
                ephemeral: true
            });
        }

        // Check user's open tickets
        const settings = interaction.client.db.getSettings(interaction.guild.id);
        const userTickets = interaction.client.db.getUserTickets(interaction.user.id, 'open');
        
        if (userTickets.length >= settings.max_open_tickets) {
            return interaction.reply({
                content: `❌ You already have ${settings.max_open_tickets} open ticket(s). Please close your existing tickets before creating a new one.`,
                ephemeral: true
            });
        }

        // Show category selection
        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ticket_category')
                    .setPlaceholder('Select a ticket category')
                    .addOptions([
                        {
                            label: 'General Support',
                            description: 'General questions and assistance',
                            value: 'general',
                            emoji: '💬'
                        },
                        {
                            label: 'Technical Issue',
                            description: 'Technical problems and bugs',
                            value: 'technical',
                            emoji: '🔧'
                        },
                        {
                            label: 'Account Issue',
                            description: 'Account related problems',
                            value: 'account',
                            emoji: '👤'
                        },
                        {
                            label: 'Billing Support',
                            description: 'Payment and billing questions',
                            value: 'billing',
                            emoji: '💳'
                        },
                        {
                            label: 'Other',
                            description: 'Other issues not listed above',
                            value: 'other',
                            emoji: '📋'
                        }
                    ])
            );

        await interaction.reply({
            content: '📝 Please select a category for your ticket:',
            components: [row],
            ephemeral: true
        });
    }
};
