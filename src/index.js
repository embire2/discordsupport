import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import Database from './database/database.js';
import chalk from 'chalk';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class TicketBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions
            ]
        });

        this.client.commands = new Collection();
        this.client.buttons = new Collection();
        this.client.selectMenus = new Collection();
        this.client.modals = new Collection();
        this.db = new Database();
    }

    async init() {
        console.log(chalk.blue('🎫 Discord Ticket Bot Starting...'));

        // Initialize database
        await this.db.init();
        this.client.db = this.db;

        // Load handlers
        await this.loadHandlers();
        await this.loadCommands();
        await this.loadInteractions();

        // Register slash commands
        await this.registerCommands();

        // Login
        await this.client.login(process.env.DISCORD_TOKEN);
    }

    async loadHandlers() {
        const handlersPath = join(__dirname, 'handlers');
        const handlerFiles = await fs.readdir(handlersPath);

        for (const file of handlerFiles) {
            if (file.endsWith('.js')) {
                const handler = await import(join(handlersPath, file));
                if (handler.default) {
                    handler.default(this.client);
                    console.log(chalk.green(`✓ Loaded handler: ${file}`));
                }
            }
        }
    }

    async loadCommands() {
        const commandsPath = join(__dirname, 'commands');
        const commandFolders = await fs.readdir(commandsPath);

        for (const folder of commandFolders) {
            const folderPath = join(commandsPath, folder);
            const stat = await fs.stat(folderPath);
            
            if (stat.isDirectory()) {
                const commandFiles = await fs.readdir(folderPath);
                
                for (const file of commandFiles) {
                    if (file.endsWith('.js')) {
                        const command = await import(join(folderPath, file));
                        if (command.default?.data?.name) {
                            this.client.commands.set(command.default.data.name, command.default);
                            console.log(chalk.green(`✓ Loaded command: ${command.default.data.name}`));
                        }
                    }
                }
            }
        }
    }

    async loadInteractions() {
        // Load buttons
        const buttonsPath = join(__dirname, 'interactions', 'buttons');
        const buttonFiles = await fs.readdir(buttonsPath);

        for (const file of buttonFiles) {
            if (file.endsWith('.js')) {
                const button = await import(join(buttonsPath, file));
                if (button.default?.customId) {
                    this.client.buttons.set(button.default.customId, button.default);
                    console.log(chalk.green(`✓ Loaded button: ${button.default.customId}`));
                }
            }
        }

        // Load select menus
        const selectMenusPath = join(__dirname, 'interactions', 'selectMenus');
        const selectMenuFiles = await fs.readdir(selectMenusPath);

        for (const file of selectMenuFiles) {
            if (file.endsWith('.js')) {
                const selectMenu = await import(join(selectMenusPath, file));
                if (selectMenu.default?.customId) {
                    this.client.selectMenus.set(selectMenu.default.customId, selectMenu.default);
                    console.log(chalk.green(`✓ Loaded select menu: ${selectMenu.default.customId}`));
                }
            }
        }

        // Load modals
        const modalsPath = join(__dirname, 'interactions', 'modals');
        const modalFiles = await fs.readdir(modalsPath);

        for (const file of modalFiles) {
            if (file.endsWith('.js')) {
                const modal = await import(join(modalsPath, file));
                if (modal.default?.customId) {
                    this.client.modals.set(modal.default.customId, modal.default);
                    console.log(chalk.green(`✓ Loaded modal: ${modal.default.customId}`));
                }
            }
        }
    }

    async registerCommands() {
        const commands = [];
        this.client.commands.forEach(command => {
            commands.push(command.data.toJSON());
        });

        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

        try {
            console.log(chalk.yellow('🔄 Registering slash commands...'));

            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands }
            );

            console.log(chalk.green('✓ Successfully registered slash commands!'));
        } catch (error) {
            console.error(chalk.red('✗ Error registering commands:'), error);
        }
    }
}

// Start the bot
const bot = new TicketBot();
bot.init().catch(error => {
    console.error(chalk.red('✗ Fatal error:'), error);
    process.exit(1);
});
