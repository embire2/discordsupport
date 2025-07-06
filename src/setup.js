import { config } from 'dotenv';
import inquirer from 'inquirer';
import fs from 'fs/promises';
import chalk from 'chalk';
import { REST, Routes } from 'discord.js';

config();

console.log(chalk.blue.bold(`
╔══════════════════════════════════════╗
║     Discord Ticket Bot Setup         ║
╚══════════════════════════════════════╝
`));

async function setup() {
    try {
        // Check if .env exists
        try {
            await fs.access('.env');
            console.log(chalk.yellow('⚠️  .env file already exists!'));
            
            const { overwrite } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: 'Do you want to overwrite the existing configuration?',
                    default: false
                }
            ]);

            if (!overwrite) {
                console.log(chalk.blue('Setup cancelled.'));
                return;
            }
        } catch (error) {
            // .env doesn't exist, continue
        }

        console.log(chalk.cyan('\n📝 Please provide the following information:\n'));

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'token',
                message: 'Discord Bot Token:',
                validate: (input) => input.length > 0 || 'Token is required!'
            },
            {
                type: 'input',
                name: 'clientId',
                message: 'Bot Client ID:',
                validate: (input) => /^\d+$/.test(input) || 'Invalid Client ID!'
            },
            {
                type: 'input',
                name: 'guildId',
                message: 'Guild (Server) ID:',
                validate: (input) => /^\d+$/.test(input) || 'Invalid Guild ID!'
            },
            {
                type: 'input',
                name: 'ticketCategory',
                message: 'Ticket Category Name:',
                default: 'Support Tickets'
            },
            {
                type: 'input',
                name: 'logChannel',
                message: 'Log Channel Name:',
                default: 'ticket-logs'
            },
            {
                type: 'input',
                name: 'supportRole',
                message: 'Support Role Name:',
                default: 'Support Team'
            },
            {
                type: 'input',
                name: 'adminRole',
                message: 'Admin Role Name:',
                default: 'Admin'
            },
            {
                type: 'input',
                name: 'embedColor',
                message: 'Embed Color (hex):',
                default: '#9E7FFF',
                validate: (input) => /^#[0-9A-F]{6}$/i.test(input) || 'Invalid hex color!'
            }
        ]);

        // Create .env file
        const envContent = `# Discord Bot Configuration
DISCORD_TOKEN=${answers.token}
CLIENT_ID=${answers.clientId}
GUILD_ID=${answers.guildId}

# Ticket Configuration
TICKET_CATEGORY_NAME=${answers.ticketCategory}
TICKET_LOG_CHANNEL_NAME=${answers.logChannel}
SUPPORT_ROLE_NAME=${answers.supportRole}
ADMIN_ROLE_NAME=${answers.adminRole}

# Bot Settings
BOT_PREFIX=!
EMBED_COLOR=${answers.embedColor}
`;

        await fs.writeFile('.env', envContent);
        console.log(chalk.green('\n✅ Configuration file created successfully!'));

        // Test bot token
        console.log(chalk.yellow('\n🔄 Testing bot connection...'));
        
        const rest = new REST({ version: '10' }).setToken(answers.token);
        
        try {
            await rest.get(Routes.user());
            console.log(chalk.green('✅ Bot token is valid!'));
        } catch (error) {
            console.log(chalk.red('❌ Invalid bot token! Please check your token and try again.'));
            return;
        }

        // Create data directory
        try {
            await fs.mkdir('data', { recursive: true });
            console.log(chalk.green('✅ Data directory created!'));
        } catch (error) {
            // Directory might already exist
        }

        console.log(chalk.green.bold(`
╔══════════════════════════════════════╗
║        Setup Complete! 🎉            ║
╚══════════════════════════════════════╝
`));

        console.log(chalk.cyan('Next steps:'));
        console.log(chalk.white('1. Run "npm start" to start the bot'));
        console.log(chalk.white('2. Use /setup command in your Discord server to configure the ticket system'));
        console.log(chalk.white('3. The bot will create the necessary channels and roles\n'));

        console.log(chalk.yellow('⚠️  Important: Make sure the bot has the following permissions:'));
        console.log(chalk.white('   - Manage Channels'));
        console.log(chalk.white('   - Manage Roles'));
        console.log(chalk.white('   - Send Messages'));
        console.log(chalk.white('   - Embed Links'));
        console.log(chalk.white('   - Attach Files'));
        console.log(chalk.white('   - Read Message History'));
        console.log(chalk.white('   - Add Reactions\n'));

    } catch (error) {
        console.error(chalk.red('❌ Setup failed:'), error);
    }
}

setup();
