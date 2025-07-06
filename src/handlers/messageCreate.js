export default (client) => {
    client.on('messageCreate', async message => {
        // Ignore bot messages
        if (message.author.bot) return;

        // Check if message is in a ticket channel
        const ticket = client.db.getTicketByChannel(message.channel.id);
        if (ticket && ticket.status === 'open') {
            // Log message for transcript
            client.db.logMessage(
                ticket.ticket_id,
                message.author.id,
                message.author.tag,
                message.content || '[Attachment/Embed]'
            );
        }
    });
};
