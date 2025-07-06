import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configure ticket settings')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View current configuration'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('maxtickets')
                .setDescription('Set maximum open tickets per user')
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('Maximum tickets (1-10)')
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(10)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcome')
                .setDescription('Set ticket welcome message')
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Welcome message')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('close')
                .setDescription('Set ticket close message')
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Close message')
                        .setRequired(true))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const settings = interaction.client.db.getSettings(interaction.guild.id);

        switch (subcommand) {
            case 'view': {
                const embed = new EmbedBuilder()
                    .setTitle('⚙️ Ticket Configuration')
                    .setColor('#9E7FFF')
                    .addFields(
                        { name: 'Ticket Category', value: settings.ticket_category_id ? `<#${settings.ticket_category_id}>` : 'Not set', inline: true },
                        { name: 'Log Channel', value: settings.log_channel_id ? `<#${settings.log_channel_id}>` : 'Not set', inline: true },
                        { name: 'Support Role', value: settings.support_role_id ? `<@&${settings.support_role_id}>` : 'Not set', inline: true },
                        { name: 'Admin Role', value: settings.admin_role_id ? `<@&${settings.admin_role_id}>` : 'Not set', inline: true },
                        { name: 'Max Tickets', value: settings.max_open_tickets.toString(), inline: true },
                        { name: 'Total Tickets', value: settings.ticket_counter.toString(), inline: true },
                        { name: 'Welcome Message', value: settings.welcome_message || 'Default message', inline: false },
                        { name: 'Close Message', value: settings.close_message || 'Default message', inline: false }
                    )
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            }

            case 'maxtickets': {
                const amount = interaction.options.getInteger('amount');
                
                interaction.client.db.updateSettings(interaction.guild.id, {
                    max_open_tickets: amount
                });

                await interaction.reply({
                    content: `✅ Maximum open tickets per user set to: ${amount}`,
                    ephemeral: true
                });
                break;
            }

            case 'welcome': {
                const message = interaction.options.getString('message');
                
                interaction.client.db.updateSettings(interaction.guild.id, {
                    welcome_message: message
                });

                await interaction.reply({
                    content: '✅ Welcome message updated!',
                    ephemeral: true
                });
                break;
            }

            case 'close': {
                const message = interaction.options.getString('message');
                
                interaction.client.db.updateSettings(interaction.guild.id, {
                    close_message: message
                });

                await interaction.reply({
                    content: '✅ Close message updated!',
                    ephemeral: true
                });
                break;
            }
        }
    }
};
