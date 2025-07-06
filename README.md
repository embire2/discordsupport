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
- **npm**: Version 8.0.0 or higher (usually comes with Node.js)
- **Python**: Version 3.11 or lower (for native module compilation)

### Ubuntu 22.04 Server Setup

#### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### 2. Install Node.js 18+ and npm
```bash
# Install Node.js 18.x LTS (includes npm)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x or higher
npm --version   # Should show v8.x.x or higher

# If npm is not installed or outdated, install/update it
sudo npm install -g npm@latest
```

#### 3. Install Build Dependencies (IMPORTANT for SQLite)
```bash
# Install Python 3 and build tools
sudo apt install -y python3 python3-pip python3-setuptools python3-distutils build-essential

# For Ubuntu 24.04 or Python 3.12+, install python3-setuptools
sudo apt install -y python3-setuptools

# Alternative: Install Python 3.11 if you have Python 3.12+
sudo apt install -y python3.11 python3.11-distutils
```

#### 4. Install Git (if not installed)
```bash
sudo apt install git -y
```

#### 5. Download the Discord Ticket Bot
```bash
# Clone the repository from GitHub
git clone https://github.com/embire2/discordsupport.git

# Navigate to the bot directory
cd discordsupport

# Verify files downloaded
ls -la
```

#### 6. Install Process Manager (Optional but Recommended)
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
- npm 8.0.0 or higher (package manager)
- Python 3.11 or lower (for SQLite compilation) OR python3-setuptools for Python 3.12+
- Discord Bot Token (from steps above)
- Discord Server with admin permissions

### Quick Setup

1. **Download the bot from GitHub**
   ```bash
   # Clone the repository
   git clone https://github.com/embire2/discordsupport.git
   
   # Navigate to the project directory
   cd discordsupport
   
   # Alternative: Download as ZIP
   # Visit: https://github.com/embire2/discordsupport
   # Click "Code" → "Download ZIP" → Extract files
   ```

2. **Fix Python Dependencies (if using Python 3.12+)**
   ```bash
   # For Ubuntu/Debian with Python 3.12+
   sudo apt install -y python3-setuptools python3-pip build-essential
   
   # Alternative: Use Python 3.11
   sudo apt install -y python3.11 python3.11-distutils
   export PYTHON=/usr/bin/python3.11
   ```

3. **Install npm dependencies**
   ```bash
   # Install all required packages
   npm install
   
   # If you get Python/distutils errors, try:
   # Option 1: Force rebuild
   npm install --build-from-source
   
   # Option 2: Use pre-built binaries
   npm install --prefer-offline --no-audit
   
   # Option 3: Clear cache and retry
   npm cache clean --force
   npm install
   
   # This will install:
   # - discord.js (Discord API library)
   # - sqlite3 (Database)
   # - dotenv (Environment variables)
   # - And other required dependencies
   ```

4. **Run the setup wizard**
   ```bash
   npm run setup
   ```
   
   The setup wizard will guide you through:
   - Bot token configuration (from Discord Developer Portal)
   - Server ID setup (your GUILD_ID)
   - Role and channel naming
   - Color customization

5. **Start the bot**
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

### Complete Installation Example (Ubuntu 22.04)

Here's a complete step-by-step installation on Ubuntu 22.04:

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18.x and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install build dependencies for SQLite
sudo apt install -y python3 python3-pip python3-setuptools build-essential

# 4. Verify installations
node --version  # Should show v18.x.x
npm --version   # Should show v8.x.x or higher
python3 --version  # Should show Python version

# 5. Update npm to latest version (optional but recommended)
sudo npm install -g npm@latest

# 6. Install Git (if needed)
sudo apt install git -y

# 7. Clone the Discord Ticket Bot
git clone https://github.com/embire2/discordsupport.git

# 8. Navigate to project
cd discordsupport

# 9. Install npm dependencies
npm install

# 10. Run setup wizard
npm run setup

# 11. Start the bot
npm start
```

### npm Installation Troubleshooting

#### Python/distutils Error (Your Current Issue)
```bash
# Solution 1: Install python3-setuptools (Recommended)
sudo apt update
sudo apt install -y python3-setuptools python3-pip build-essential

# Solution 2: Use Python 3.11 instead of 3.12
sudo apt install -y python3.11 python3.11-distutils
# Set Python 3.11 as default for npm
export PYTHON=/usr/bin/python3.11
npm install

# Solution 3: Install distutils for Python 3.12 (Ubuntu 24.04)
sudo apt install -y python3-distutils-extra

# Solution 4: Use pre-built SQLite binaries
npm install sqlite3 --build-from-source --sqlite=/usr
```

#### General npm Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# If permission errors occur (Linux/macOS)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Alternative: Use npx for one-time installations
npx create-discord-bot@latest
```

### Windows Installation

For Windows users:

```cmd
# 1. Download and install Node.js from https://nodejs.org
# 2. Install Python 3.11 from https://python.org (NOT 3.12+)
# 3. Open Command Prompt or PowerShell as Administrator
# 4. Verify installation
node --version
npm --version
python --version

# 5. Clone the repository
git clone https://github.com/embire2/discordsupport.git

# 6. Navigate to project
cd discordsupport

# 7. Install Windows Build Tools (if needed)
npm install --global windows-build-tools

# 8. Install dependencies
npm install

# 9. Run setup
npm run setup

# 10. Start the bot
npm start
```

## Production Deployment (Ubuntu 22.04) 🚀

### Using PM2 (Recommended)
```bash
# Navigate to bot directory
cd discordsupport

# Ensure all dependencies are installed
npm install --production

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

Add this content (replace `your-username` with your actual username):
```ini
[Unit]
Description=Discord Ticket Bot
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/home/your-username/discordsupport
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

### npm Installation Issues

#### Python 3.12+ distutils Error
This is the most common issue on newer systems. Python 3.12 removed distutils module.

**Solutions:**
```bash
# Best solution: Install setuptools
sudo apt install -y python3-setuptools python3-pip

# Alternative 1: Use Python 3.11
sudo apt install -y python3.11 python3.11-distutils
export PYTHON=/usr/bin/python3.11
npm install

# Alternative 2: Install from source with system SQLite
npm install sqlite3 --build-from-source --sqlite=/usr

# Alternative 3: Use different SQLite package
npm uninstall sqlite3 better-sqlite3
npm install @vscode/sqlite3
```

#### Other npm Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check npm configuration
npm config list
npm config get registry

# Fix permission issues (Linux/macOS)
sudo chown -R $(whoami) ~/.npm
```

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

# Check if repository is up to date
cd discordsupport
git pull origin main
npm install  # Install any new dependencies
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

# Keep npm packages updated
npm audit
npm audit fix
npm update
```

## Development 💻

### Project Structure
```
discordsupport/
├── src/
│   ├── commands/        # Slash commands
│   ├── interactions/    # Buttons, menus, modals
│   ├── handlers/        # Event handlers
│   ├── database/        # Database management
│   ├── index.js         # Main bot file
│   └── setup.js         # Setup wizard
├── data/                # Database storage
├── node_modules/        # npm dependencies (auto-generated)
├── .env                 # Configuration
├── package.json         # npm dependencies and scripts
├── package-lock.json    # npm dependency lock file
└── README.md           # Documentation
```

### Adding New Features
1. Commands go in `src/commands/[category]/`
2. Buttons go in `src/interactions/buttons/`
3. Follow the existing pattern for consistency
4. Install new dependencies with `npm install package-name`

### Updating the Bot
```bash
# Navigate to bot directory
cd discordsupport

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Restart the bot
pm2 restart ticket-bot
# or
sudo systemctl restart ticket-bot
```

## Support 💬

If you encounter issues:
1. Check the troubleshooting section
2. Ensure all permissions are set correctly
3. Review the bot logs for errors
4. Verify your configuration in `.env`
5. Check Discord Developer Portal for any issues
6. Ensure npm dependencies are properly installed
7. Visit the GitHub repository: https://github.com/embire2/discordsupport

## License 📄

This project is licensed under the MIT License.

---

Made with ❤️ for Discord communities needing professional support management.
