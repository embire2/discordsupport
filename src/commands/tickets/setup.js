import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup the ticket system')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('category')
                .setDescription('Category for ticket channels')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory))
        .addChannelOption(option =>
            option.setName('logs')
                .setDescription('Channel for ticket logs')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
        .addRoleOption(option =>
            option.setName('support')
                .setDescription('Support team role')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('admin')
                .setDescription('Admin role')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const category = interaction.options.getChannel('category');
        const logsChannel = interaction.options.getChannel('logs');
        const supportRole = interaction.options.getRole('support');
        const adminRole = interaction.options.getRole('admin');

        // Update settings
        interaction.client.db.updateSettings(interaction.guild.id, {
            ticket_category_id: category.id,
            log_channel_id: logsChannel.id,
            support_role_id: supportRole.id,
            admin_role_id: adminRole.id
        });

        // Create ticket panel embed
        const embed = new EmbedBuilder()
            .setTitle('🎫 Support Ticket System')
            .setDescription('Need help? Create a support ticket by clicking the button below!\n\n**Before creating a ticket:**\n• Check our FAQ and documentation\n• Be ready to describe your issue clearly\n• Have any relevant information ready\n\n**Ticket Guidelines:**\n• One issue per ticket\n• Be respectful to support staff\n• Provide as much detail as possible')
            .setColor(process.env.EMBED_COLOR || '#9E7FFF')
            .setFooter({ text: 'Our support team will assist you as soon as possible' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket')
                    .setLabel('Create Ticket')
                    .setEmoji('🎫')
                    .setStyle(ButtonStyle.Primary)
            );

        // Send panel to current channel
        await interaction.channel.send({
            embeds: [embed],
            components: [row]
        });

        await interaction.editReply({
            content: `✅ Ticket system setup complete!\n\n**Configuration:**\n• Category: ${category}\n• Logs: ${logsChannel}\n• Support Role: ${supportRole}\n• Admin Role: ${adminRole}\n\nThe ticket panel has been sent to this channel.`
        });
    }
};
