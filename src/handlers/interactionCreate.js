export default (client) => {
    client.on('interactionCreate', async interaction => {
        // Handle slash commands
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing command ${interaction.commandName}:`, error);
                
                const errorMessage = {
                    content: '❌ There was an error executing this command!',
                    ephemeral: true
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            }
        }

        // Handle button interactions
        if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (!button) return;

            try {
                await button.execute(interaction);
            } catch (error) {
                console.error(`Error handling button ${interaction.customId}:`, error);
                await interaction.reply({
                    content: '❌ There was an error processing this button!',
                    ephemeral: true
                });
            }
        }

        // Handle select menu interactions
        if (interaction.isStringSelectMenu()) {
            const selectMenu = client.selectMenus.get(interaction.customId);
            if (!selectMenu) return;

            try {
                await selectMenu.execute(interaction);
            } catch (error) {
                console.error(`Error handling select menu ${interaction.customId}:`, error);
                await interaction.reply({
                    content: '❌ There was an error processing this selection!',
                    ephemeral: true
                });
            }
        }

        // Handle modal submissions
        if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);
            if (!modal) return;

            try {
                await modal.execute(interaction);
            } catch (error) {
                console.error(`Error handling modal ${interaction.customId}:`, error);
                await interaction.reply({
                    content: '❌ There was an error processing this form!',
                    ephemeral: true
                });
            }
        }
    });
};
