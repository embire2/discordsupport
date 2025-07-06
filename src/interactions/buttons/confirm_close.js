import { EmbedBuilder } from 'discord.js';

export default {
    customId: 'confirm_close',
    
    async execute(interaction) {
        await interaction.deferUpdate();
        
        const ticket = interaction.client.db.getTicketByChannel(interaction.channel.id);
        const settings = interaction.client.db.getSettings(interaction.guild.id);

        // Update ticket status
        interaction.client.db.updateTicketStatus(ticket.ticket_id, 'closed', interaction.user.id);

        // Generate transcript
        const messages = interaction.client.db.getTicketMessages(ticket.ticket_id);
        let transcript = `Ticket: ${ticket.ticket_id}\nCreated by: ${ticket.user_id}\nClosed by: ${interaction.user.tag}\n\n--- Transcript ---\n\n`;
        
        for (const msg of messages) {
            transcript += `[${new Date(msg.timestamp).toLocaleString()}] ${msg.username}: ${msg.content}\n`;
        }

        // Send closing message
        const closeEmbed = new EmbedBuilder()
            .setTitle('🔒 Ticket Closed')
            .setDescription(settings.close_message || 'This ticket has been closed. The channel will be deleted in 5 seconds.')
            .setColor('#ef4444')
            .setTimestamp();

        await interaction.channel.send({ embeds: [closeEmbed] });

        // Send log
        const logChannel = interaction.guild.channels.cache.get(settings.log_channel_id);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setTitle('Ticket Closed')
                .setColor('#ef4444')
                .addFields(
                    { name: 'Ticket', value: ticket.ticket_id, inline: true },
                    { name: 'Closed By', value: interaction.user.tag, inline: true }
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
    }
};
