import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View bot commands and information'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🎫 Ticket Bot Help')
            .setColor('#9E7FFF')
            .setDescription('A comprehensive Discord ticket system for support management.')
            .addFields(
                {
                    name: '👤 User Commands',
                    value: `\`/ticket close\` - Close your ticket
                    \`/ticket add\` - Add a user to your ticket
                    \`/ticket remove\` - Remove a user from your ticket
                    \`/help\` - Show this help menu`,
                    inline: false
                },
                {
                    name: '👮 Staff Commands',
                    value: `\`/ticket claim\` - Claim a ticket
                    \`/ticket rename\` - Rename a ticket
                    \`/blacklist\` - Manage ticket blacklist
                    \`/stats\` - View ticket statistics`,
                    inline: false
                },
                {
                    name: '⚙️ Admin Commands',
                    value: `\`/setup\` - Setup the ticket system
                    \`/config\` - Configure ticket settings`,
                    inline: false
                },
                {
                    name: '📝 How to Use',
                    value: '1. Click the "Create Ticket" button in the ticket panel\n2. Select a category for your issue\n3. Describe your problem in detail\n4. Wait for support staff to assist you',
                    inline: false
                }
            )
            .setFooter({ text: 'Need help? Create a ticket!' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
