import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class TicketDatabase {
    constructor() {
        this.db = null;
    }

    async init() {
        try {
            this.db = new Database(join(__dirname, '../../data/tickets.db'));
            
            // Create tables
            this.createTables();
            
            console.log(chalk.green('✓ Database initialized'));
        } catch (error) {
            console.error(chalk.red('✗ Database initialization error:'), error);
            throw error;
        }
    }

    createTables() {
        // Tickets table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ticket_id TEXT UNIQUE NOT NULL,
                channel_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                category TEXT DEFAULT 'General',
                status TEXT DEFAULT 'open',
                claimed_by TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                closed_at DATETIME,
                closed_by TEXT,
                transcript TEXT
            )
        `);

        // Ticket messages table for transcripts
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS ticket_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ticket_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                username TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
            )
        `);

        // Settings table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS settings (
                guild_id TEXT PRIMARY KEY,
                ticket_category_id TEXT,
                log_channel_id TEXT,
                support_role_id TEXT,
                admin_role_id TEXT,
                ticket_counter INTEGER DEFAULT 0,
                welcome_message TEXT,
                close_message TEXT,
                max_open_tickets INTEGER DEFAULT 3
            )
        `);

        // Blacklist table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS blacklist (
                user_id TEXT PRIMARY KEY,
                reason TEXT,
                banned_by TEXT,
                banned_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    // Ticket methods
    createTicket(ticketId, channelId, userId, category = 'General') {
        const stmt = this.db.prepare(`
            INSERT INTO tickets (ticket_id, channel_id, user_id, category)
            VALUES (?, ?, ?, ?)
        `);
        return stmt.run(ticketId, channelId, userId, category);
    }

    getTicket(ticketId) {
        const stmt = this.db.prepare('SELECT * FROM tickets WHERE ticket_id = ?');
        return stmt.get(ticketId);
    }

    getTicketByChannel(channelId) {
        const stmt = this.db.prepare('SELECT * FROM tickets WHERE channel_id = ?');
        return stmt.get(channelId);
    }

    getUserTickets(userId, status = null) {
        let query = 'SELECT * FROM tickets WHERE user_id = ?';
        const params = [userId];
        
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        
        const stmt = this.db.prepare(query);
        return stmt.all(...params);
    }

    updateTicketStatus(ticketId, status, closedBy = null) {
        const updates = ['status = ?'];
        const params = [status];

        if (status === 'closed' && closedBy) {
            updates.push('closed_at = CURRENT_TIMESTAMP', 'closed_by = ?');
            params.push(closedBy);
        }

        const stmt = this.db.prepare(`
            UPDATE tickets SET ${updates.join(', ')} WHERE ticket_id = ?
        `);
        params.push(ticketId);
        return stmt.run(...params);
    }

    claimTicket(ticketId, userId) {
        const stmt = this.db.prepare('UPDATE tickets SET claimed_by = ? WHERE ticket_id = ?');
        return stmt.run(userId, ticketId);
    }

    // Message logging for transcripts
    logMessage(ticketId, userId, username, content) {
        const stmt = this.db.prepare(`
            INSERT INTO ticket_messages (ticket_id, user_id, username, content)
            VALUES (?, ?, ?, ?)
        `);
        return stmt.run(ticketId, userId, username, content);
    }

    getTicketMessages(ticketId) {
        const stmt = this.db.prepare('SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY timestamp');
        return stmt.all(ticketId);
    }

    // Settings methods
    getSettings(guildId) {
        const stmt = this.db.prepare('SELECT * FROM settings WHERE guild_id = ?');
        let settings = stmt.get(guildId);
        
        if (!settings) {
            // Create default settings
            const insertStmt = this.db.prepare('INSERT INTO settings (guild_id) VALUES (?)');
            insertStmt.run(guildId);
            settings = stmt.get(guildId);
        }
        
        return settings;
    }

    updateSettings(guildId, settings) {
        const keys = Object.keys(settings);
        const updates = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => settings[key]);
        
        const stmt = this.db.prepare(`UPDATE settings SET ${updates} WHERE guild_id = ?`);
        return stmt.run(...values, guildId);
    }

    incrementTicketCounter(guildId) {
        const stmt = this.db.prepare('UPDATE settings SET ticket_counter = ticket_counter + 1 WHERE guild_id = ?');
        stmt.run(guildId);
        
        const getStmt = this.db.prepare('SELECT ticket_counter FROM settings WHERE guild_id = ?');
        return getStmt.get(guildId).ticket_counter;
    }

    // Blacklist methods
    blacklistUser(userId, reason, bannedBy) {
        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO blacklist (user_id, reason, banned_by)
            VALUES (?, ?, ?)
        `);
        return stmt.run(userId, reason, bannedBy);
    }

    unblacklistUser(userId) {
        const stmt = this.db.prepare('DELETE FROM blacklist WHERE user_id = ?');
        return stmt.run(userId);
    }

    isBlacklisted(userId) {
        const stmt = this.db.prepare('SELECT * FROM blacklist WHERE user_id = ?');
        return stmt.get(userId);
    }

    getBlacklist() {
        const stmt = this.db.prepare('SELECT * FROM blacklist');
        return stmt.all();
    }

    // Statistics
    getStats(guildId) {
        const totalTickets = this.db.prepare('SELECT COUNT(*) as count FROM tickets').get().count;
        const openTickets = this.db.prepare('SELECT COUNT(*) as count FROM tickets WHERE status = "open"').get().count;
        const closedTickets = this.db.prepare('SELECT COUNT(*) as count FROM tickets WHERE status = "closed"').get().count;
        
        const topUsers = this.db.prepare(`
            SELECT user_id, COUNT(*) as ticket_count 
            FROM tickets 
            GROUP BY user_id 
            ORDER BY ticket_count DESC 
            LIMIT 5
        `).all();

        const topSupport = this.db.prepare(`
            SELECT claimed_by as user_id, COUNT(*) as claimed_count 
            FROM tickets 
            WHERE claimed_by IS NOT NULL 
            GROUP BY claimed_by 
            ORDER BY claimed_count DESC 
            LIMIT 5
        `).all();

        return {
            totalTickets,
            openTickets,
            closedTickets,
            topUsers,
            topSupport
        };
    }
}
