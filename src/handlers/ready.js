import chalk from 'chalk';
import { ActivityType } from 'discord.js';

export default (client) => {
    client.once('ready', async () => {
        console.log(chalk.green(`✓ Logged in as ${client.user.tag}!`));
        console.log(chalk.blue(`📊 Serving ${client.guilds.cache.size} guilds`));

        // Set bot activity
        client.user.setActivity('Support Tickets | /help', { 
            type: ActivityType.Watching 
        });

        // Ensure settings exist for all guilds
        for (const guild of client.guilds.cache.values()) {
            client.db.getSettings(guild.id);
        }
    });
};
