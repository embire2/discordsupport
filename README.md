# Discord Ticket Bot 🎫

A comprehensive Discord support ticket bot with full admin management features. This bot allows users to create support tickets and provides admins with powerful tools to manage them efficiently.

## Features ✨

- **Ticket Creation System**
  - Category selection for different issue types
  - Automatic channel creation with proper permissions
  - User-friendly ticket panel with buttons
  - Ticket ID generation and tracking

- **Ticket Management**
  - Close tickets with confirmation
  - Add/remove users from tickets
  - Claim tickets (for support staff)
  - Rename tickets
  - Automatic transcript generation

- **Admin Features**
  - User blacklist management
  - Comprehensive statistics
  - Configurable settings
  - Ticket logs with transcripts
  - Maximum ticket limits per user

- **Security & Permissions**
  - Role-based access control
  - Blacklist system
  - Permission checks for all actions
  - Secure database storage

## Hosting Requirements 🖥️

### Where to Host
The Discord Ticket Bot can be hosted on various platforms:

**✅ Recommended Hosting Options:**
- **VPS/Dedicated Servers** (Ubuntu 22.04, CentOS, Debian)
- **Cloud Platforms** (AWS EC2, Google Cloud, DigitalOcean, Linode)
- **Local Servers** (Home servers, Raspberry Pi 4+)
- **Hosting Services** (Heroku, Railway, Render)

**✅ Ubuntu 22.04 Server - Fully Supported!**
Yes, Ubuntu 22.04 LTS is an excellent choice for hosting this bot. It's fully compatible and recommended.

### System Requirements
- **OS**: Linux (Ubuntu 22.04+), Windows 10+, macOS 10.15+
- **RAM**: Minimum 512MB, Recommended 1GB+
- **Storage**: 1GB free space (for logs and database)
- **Network**: Stable internet connection
- **Node.js**: Version 18.0.0 or higher

### Ubuntu 22.04 Server Setup

#### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### 2. Install Node.js 18+
```bash
# Install Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x or higher
npm --version
```

#### 3. Install Git (if not installed)
```bash
sudo apt install git -y
```

#### 4. Create Bot Directory
```bash
mkdir ~/discord-ticket-bot
cd ~/discord-ticket-bot
```

#### 5. Install Process Manager (Optional but Recommended)
```bash
# Install PM2 for process management
sudo npm install -g pm2

# Or install screen for simple session management
sudo apt install screen -y
```

## Discord Bot Setup & Connection 🔗

### Step 1: Create Discord Application

1. **Go to Discord Developer Portal**
   - Visit: https://discord.com/developers/applications
   - Log in with your Discord account

2. **Create New Application**
   - Click "New Application"
   - Enter a name for your bot (e.g., "Support Ticket Bot")
   - Click "Create"

3. **Configure Application**
   - Add description and icon (optional)
   - Note down the **Application ID** (this is your CLIENT_ID)

### Step 2: Create Bot User

1. **Navigate to Bot Section**
   - Click "Bot" in the left sidebar
   - Click "Add Bot" → "Yes, do it!"

2. **Configure Bot Settings**
   - Set bot username and avatar
   - **Important**: Under "Privileged Gateway Intents"
     - ✅ Enable "Server Members Intent"
     - ✅ Enable "Message Content Intent"

3. **Get Bot Token**
   - Click "Reset Token" → "Yes, do it!"
   - **Copy the token immediately** (you won't see it again)
   - This is your `DISCORD_TOKEN`

### Step 3: Set Bot Permissions

1. **Go to OAuth2 → URL Generator**
   - **Scopes**: Check `bot` and `applications.commands`
   - **Bot Permissions**: Check these permissions:
     ```
     ✅ Manage Channels
     ✅ Manage Roles  
     ✅ Send Messages
     ✅ Embed Links
     ✅ Attach Files
     ✅ Read Message History
     ✅ Add Reactions
     ✅ View Channels
     ✅ Use Slash Commands
     ```

2. **Generate Invite URL**
   - Copy the generated URL at the bottom
   - This URL will invite your bot to servers

### Step 4: Invite Bot to Your Server

1. **Use the Generated URL**
   - Paste the OAuth2 URL in your browser
   - Select your Discord server
   - Click "Authorize"
   - Complete the captcha

2. **Verify Bot Joined**
   - Check your Discord server
   - Bot should appear in member list (offline until started)

### Step 5: Get Server Information

1. **Enable Developer Mode**
   - Discord Settings → Advanced → Developer Mode (ON)

2. **Get Guild ID**
   - Right-click your server name
   - Click "Copy Server ID"
   - This is your `GUILD_ID`

## Installation 🚀

### Prerequisites
- Node.js 18.0.0 or higher
- Discord Bot Token (from steps above)
- Discord Server with admin permissions

### Quick Setup

1. **Download/Clone the bot files**
   ```bash
   # If using git
   git clone <repository-url>
   cd discord-ticket-bot
   
   # Or extract downloaded files
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the setup wizard**
   ```bash
   npm run setup
   ```
   
   The setup wizard will guide you through:
   - Bot token configuration (from Discord Developer Portal)
   - Server ID setup (your GUILD_ID)
   - Role and channel naming
   - Color customization

4. **Start the bot**
   ```bash
   # For development/testing
   npm start
   
   # For production (Ubuntu server with PM2)
   pm2 start src/index.js --name "ticket-bot"
   pm2 save
   pm2 startup
   
   # Or with screen (simple method)
   screen -S ticket-bot
   npm start
   # Press Ctrl+A then D to detach
   ```

### Manual Setup (Alternative)

1. Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your credentials:
   ```env
   DISCORD_TOKEN=your_bot_token_from_developer_portal
   CLIENT_ID=your_application_id_from_developer_portal
   GUILD_ID=your_server_id_from_discord
   ```

3. Customize other settings as needed

## Production Deployment (Ubuntu 22.04) 🚀

### Using PM2 (Recommended)
```bash
# Start bot with PM2
pm2 start src/index.js --name "ticket-bot"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the displayed command

# Monitor bot
pm2 status
pm2 logs ticket-bot
pm2 restart ticket-bot
```

### Using Systemd Service
```bash
# Create service file
sudo nano /etc/systemd/system/ticket-bot.service
```

Add this content:
```ini
[Unit]
Description=Discord Ticket Bot
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/home/your-username/discord-ticket-bot
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable ticket-bot
sudo systemctl start ticket-bot
sudo systemctl status ticket-bot
```

## Bot Permissions 🔐

Ensure your bot has these permissions in your Discord server:
- Manage Channels
- Manage Roles
- Send Messages
- Embed Links
- Attach Files
- Read Message History
- Add Reactions
- View Channels

**Important**: The bot's role must be positioned higher than the Support Team and Admin roles in your server's role hierarchy.

## Commands 📝

### User Commands
- `/help` - View all commands and information
- `/ticket close [reason]` - Close your ticket
- `/ticket add <user>` - Add a user to your ticket
- `/ticket remove <user>` - Remove a user from your ticket

### Staff Commands
- `/ticket claim` - Claim a ticket
- `/ticket rename <name>` - Rename a ticket
- `/blacklist add <user> <reason>` - Blacklist a user
- `/blacklist remove <user>` - Unblacklist a user
- `/blacklist list` - View blacklisted users
- `/stats` - View ticket statistics

### Admin Commands
- `/setup` - Initial bot setup (creates ticket panel)
- `/config view` - View current configuration
- `/config maxtickets <amount>` - Set max tickets per user
- `/config welcome <message>` - Set welcome message
- `/config close <message>` - Set close message

## First Time Setup 🎯

1. After starting the bot, use `/setup` in your Discord server
2. Select:
   - A category for ticket channels
   - A channel for ticket logs
   - A support team role
   - An admin role

3. The bot will create a ticket panel in the current channel
4. Users can click "Create Ticket" to start

## Configuration Options ⚙️

### Environment Variables
- `DISCORD_TOKEN` - Your bot token (from Developer Portal)
- `CLIENT_ID` - Bot's client ID (Application ID)
- `GUILD_ID` - Your server ID (right-click server name)
- `TICKET_CATEGORY_NAME` - Name for ticket category
- `TICKET_LOG_CHANNEL_NAME` - Name for log channel
- `SUPPORT_ROLE_NAME` - Support team role name
- `ADMIN_ROLE_NAME` - Admin role name
- `BOT_PREFIX` - Command prefix (default: !)
- `EMBED_COLOR` - Embed color in hex

### Configurable Settings
- Maximum open tickets per user
- Custom welcome message
- Custom close message
- Ticket categories

## Database 💾

The bot uses SQLite for data storage:
- Ticket information
- User messages (for transcripts)
- Server settings
- Blacklist data
- Statistics

Database file is stored in `data/tickets.db`

## Troubleshooting 🔧

### Bot not responding to commands
- Ensure the bot has proper permissions
- Check if slash commands are registered (may take up to 1 hour)
- Verify bot token is correct
- Ensure bot is online in your server

### Cannot create tickets
- Run `/setup` first to configure the system
- Check if ticket category exists
- Ensure bot can create channels in the category
- Verify bot role is higher than support roles

### Missing permissions errors
- Bot needs "Administrator" or specific permissions listed above
- Bot role must be higher than roles it needs to manage
- Check channel-specific permissions

### Connection Issues (Ubuntu Server)
```bash
# Check if bot is running
pm2 status
# or
sudo systemctl status ticket-bot

# Check logs
pm2 logs ticket-bot
# or
sudo journalctl -u ticket-bot -f

# Check network connectivity
ping discord.com
```

## Security Considerations 🔒

### For Production Servers
- Keep your bot token secure and never share it
- Use environment variables for sensitive data
- Regularly update Node.js and dependencies
- Set up firewall rules (UFW on Ubuntu)
- Consider using a reverse proxy (nginx)
- Enable automatic security updates

```bash
# Ubuntu security setup
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Auto-updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

## Development 💻

### Project Structure
```
discord-ticket-bot/
├── src/
│   ├── commands/        # Slash commands
│   ├── interactions/    # Buttons, menus, modals
│   ├── handlers/        # Event handlers
│   ├── database/        # Database management
│   ├── index.js         # Main bot file
│   └── setup.js         # Setup wizard
├── data/                # Database storage
├── .env                 # Configuration
├── package.json         # Dependencies
└── README.md           # Documentation
```

### Adding New Features
1. Commands go in `src/commands/[category]/`
2. Buttons go in `src/interactions/buttons/`
3. Follow the existing pattern for consistency

## Support 💬

If you encounter issues:
1. Check the troubleshooting section
2. Ensure all permissions are set correctly
3. Review the bot logs for errors
4. Verify your configuration in `.env`
5. Check Discord Developer Portal for any issues

## License 📄

This project is licensed under the MIT License.

---

Made with ❤️ for Discord communities needing professional support management.
