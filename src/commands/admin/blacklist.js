import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Manage ticket blacklist')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a user to the blacklist')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to blacklist')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for blacklisting')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a user from the blacklist')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to unblacklist')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('View the blacklist')),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'add': {
                const user = interaction.options.getUser('user');
                const reason = interaction.options.getString('reason');

                interaction.client.db.blacklistUser(user.id, reason, interaction.user.id);

                const embed = new EmbedBuilder()
                    .setTitle('User Blacklisted')
                    .setDescription(`${user} has been blacklisted from creating tickets.`)
                    .addFields(
                        { name: 'Reason', value: reason },
                        { name: 'Blacklisted by', value: interaction.user.tag }
                    )
                    .setColor('#ef4444')
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
                break;
            }

            case 'remove': {
                const user = interaction.options.getUser('user');

                interaction.client.db.unblacklistUser(user.id);

                const embed = new EmbedBuilder()
                    .setTitle('User Unblacklisted')
                    .setDescription(`${user} has been removed from the blacklist.`)
                    .setColor('#10b981')
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
                break;
            }

            case 'list': {
                const blacklist = interaction.client.db.getBlacklist();

                if (blacklist.length === 0) {
                    return interaction.reply({
                        content: '📋 The blacklist is empty.',
                        ephemeral: true
                    });
                }

                const embed = new EmbedBuilder()
                    .setTitle('Ticket Blacklist')
                    .setColor('#9E7FFF')
                    .setTimestamp();

                let description = '';
                for (const entry of blacklist) {
                    description += `<@${entry.user_id}> - ${entry.reason}\n`;
                }

                embed.setDescription(description);

                await interaction.reply({ embeds: [embed], ephemeral: true });
                break;
            }
        }
    }
};
