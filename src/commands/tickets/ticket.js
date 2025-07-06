import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Manage tickets')
        .addSubcommand(subcommand =>
            subcommand
                .setName('close')
                .setDescription('Close the current ticket')
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for closing')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a user to the ticket')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to add')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a user from the ticket')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User to remove')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('claim')
                .setDescription('Claim this ticket'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('rename')
                .setDescription('Rename the ticket')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('New ticket name')
                        .setRequired(true))),

    async execute(interaction) {
        const ticket = interaction.client.db.getTicketByChannel(interaction.channel.id);
        
        if (!ticket || ticket.status !== 'open') {
            return interaction.reply({
                content: '❌ This command can only be used in an open ticket channel!',
                ephemeral: true
            });
        }

        const subcommand = interaction.options.getSubcommand();
        const settings = interaction.client.db.getSettings(interaction.guild.id);

        switch (subcommand) {
            case 'close': {
                const reason = interaction.options.getString('reason') || 'No reason provided';
                
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

                await interaction.reply('🔒 Closing ticket...');

                // Update ticket status
                interaction.client.db.updateTicketStatus(ticket.ticket_id, 'closed', interaction.user.id);

                // Generate transcript
                const messages = interaction.client.db.getTicketMessages(ticket.ticket_id);
                let transcript = `Ticket: ${ticket.ticket_id}\nCreated by: ${ticket.user_id}\nClosed by: ${interaction.user.tag}\nReason: ${reason}\n\n--- Transcript ---\n\n`;
                
                for (const msg of messages) {
                    transcript += `[${new Date(msg.timestamp).toLocaleString()}] ${msg.username}: ${msg.content}\n`;
                }

                // Send log
                const logChannel = interaction.guild.channels.cache.get(settings.log_channel_id);
                if (logChannel) {
                    const logEmbed = new EmbedBuilder()
                        .setTitle('Ticket Closed')
                        .setColor('#ef4444')
                        .addFields(
                            { name: 'Ticket', value: ticket.ticket_id, inline: true },
                            { name: 'Closed By', value: interaction.user.tag, inline: true },
                            { name: 'Reason', value: reason, inline: false }
                        )
                        .setTimestamp();

                    await logChannel.send({
                        embeds: [logEmbed],
                        files: [{
                            attachment: Buffer.from(transcript),
                            name: `${ticket.ticket_id}-transcript.txt`
                        }]
                    });
                }

                // Delete channel after 5 seconds
                setTimeout(() => {
                    interaction.channel.delete().catch(console.error);
                }, 5000);

                break;
            }

            case 'add': {
                const user = interaction.options.getUser('user');
                
                await interaction.channel.permissionOverwrites.create(user, {
                    ViewChannel: true,
                    SendMessages: true,
                    ReadMessageHistory: true
                });

                await interaction.reply({
                    content: `✅ Added ${user} to the ticket.`,
                    ephemeral: true
                });

                const embed = new EmbedBuilder()
                    .setDescription(`${user} was added to the ticket by ${interaction.user}`)
                    .setColor('#10b981');

                await interaction.channel.send({ embeds: [embed] });
                break;
            }

            case 'remove': {
                const user = interaction.options.getUser('user');
                
                if (user.id === ticket.user_id) {
                    return interaction.reply({
                        content: '❌ Cannot remove the ticket creator!',
                        ephemeral: true
                    });
                }

                await interaction.channel.permissionOverwrites.delete(user);

                await interaction.reply({
                    content: `✅ Removed ${user} from the ticket.`,
                    ephemeral: true
                });

                const embed = new EmbedBuilder()
                    .setDescription(`${user} was removed from the ticket by ${interaction.user}`)
                    .setColor('#f59e0b');

                await interaction.channel.send({ embeds: [embed] });
                break;
            }

            case 'claim': {
                if (!interaction.member.roles.cache.has(settings.support_role_id) && 
                    !interaction.member.roles.cache.has(settings.admin_role_id)) {
                    return interaction.reply({
                        content: '❌ Only support staff can claim tickets!',
                        ephemeral: true
                    });
                }

                interaction.client.db.claimTicket(ticket.ticket_id, interaction.user.id);

                const embed = new EmbedBuilder()
                    .setDescription(`🎯 Ticket claimed by ${interaction.user}`)
                    .setColor('#9E7FFF');

                await interaction.reply({ embeds: [embed] });
                break;
            }

            case 'rename': {
                const newName = interaction.options.getString('name');
                
                await interaction.channel.setName(newName);

                await interaction.reply({
                    content: `✅ Ticket renamed to: ${newName}`,
                    ephemeral: true
                });
                break;
            }
        }
    }
};
