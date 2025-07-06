import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class TicketDatabase {
    constructor() {
        this.db = null;
    }

    async init() {
        try {
            // Ensure data directory exists
            const dataDir = join(__dirname, '../../data');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            const dbPath = join(dataDir, 'tickets.db');
            
            return new Promise((resolve, reject) => {
                this.db = new sqlite3.Database(dbPath, (err) => {
                    if (err) {
                        console.error(chalk.red('✗ Database connection error:'), err);
                        reject(err);
                    } else {
                        console.log(chalk.green('✓ Database connected'));
                        
                        // Create tables
                        this.createTables()
                            .then(() => {
                                console.log(chalk.green('✓ Database initialized'));
                                resolve();
                            })
                            .catch(reject);
                    }
                });
            });
        } catch (error) {
            console.error(chalk.red('✗ Database initialization error:'), error);
            throw error;
        }
    }

    createTables() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                // Tickets table
                this.db.run(`
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
                `, (err) => {
                    if (err) reject(err);
                });

                // Ticket messages table for transcripts
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS ticket_messages (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        ticket_id TEXT NOT NULL,
                        user_id TEXT NOT NULL,
                        username TEXT NOT NULL,
                        content TEXT NOT NULL,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
                    )
                `, (err) => {
                    if (err) reject(err);
                });

                // Settings table
                this.db.run(`
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
                `, (err) => {
                    if (err) reject(err);
                });

                // Blacklist table
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS blacklist (
                        user_id TEXT PRIMARY KEY,
                        reason TEXT,
                        banned_by TEXT,
                        banned_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    }

    // Helper method to run queries that return data
    async runQuery(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // Helper method to run queries that return multiple rows
    async runQueryAll(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Helper method to run queries that modify data
    async runUpdate(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID, changes: this.changes });
            });
        });
    }

    // Ticket methods
    async createTicket(ticketId, channelId, userId, category = 'General') {
        const sql = `
            INSERT INTO tickets (ticket_id, channel_id, user_id, category)
            VALUES (?, ?, ?, ?)
        `;
        return this.runUpdate(sql, [ticketId, channelId, userId, category]);
    }

    async getTicket(ticketId) {
        const sql = 'SELECT * FROM tickets WHERE ticket_id = ?';
        return this.runQuery(sql, [ticketId]);
    }

    async getTicketByChannel(channelId) {
        const sql = 'SELECT * FROM tickets WHERE channel_id = ?';
        return this.runQuery(sql, [channelId]);
    }

    async getUserTickets(userId, status = null) {
        let sql = 'SELECT * FROM tickets WHERE user_id = ?';
        const params = [userId];
        
        if (status) {
            sql += ' AND status = ?';
            params.push(status);
        }
        
        return this.runQueryAll(sql, params);
    }

    async updateTicketStatus(ticketId, status, closedBy = null) {
        const updates = ['status = ?'];
        const params = [status];

        if (status === 'closed' && closedBy) {
            updates.push('closed_at = CURRENT_TIMESTAMP', 'closed_by = ?');
            params.push(closedBy);
        }

        const sql = `UPDATE tickets SET ${updates.join(', ')} WHERE ticket_id = ?`;
        params.push(ticketId);
        return this.runUpdate(sql, params);
    }

    async claimTicket(ticketId, userId) {
        const sql = 'UPDATE tickets SET claimed_by = ? WHERE ticket_id = ?';
        return this.runUpdate(sql, [userId, ticketId]);
    }

    // Message logging for transcripts
    async logMessage(ticketId, userId, username, content) {
        const sql = `
            INSERT INTO ticket_messages (ticket_id, user_id, username, content)
            VALUES (?, ?, ?, ?)
        `;
        return this.runUpdate(sql, [ticketId, userId, username, content]);
    }

    async getTicketMessages(ticketId) {
        const sql = 'SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY timestamp';
        return this.runQueryAll(sql, [ticketId]);
    }

    // Settings methods
    async getSettings(guildId) {
        const sql = 'SELECT * FROM settings WHERE guild_id = ?';
        let settings = await this.runQuery(sql, [guildId]);
        
        if (!settings) {
            // Create default settings
            const insertSql = 'INSERT INTO settings (guild_id) VALUES (?)';
            await this.runUpdate(insertSql, [guildId]);
            settings = await this.runQuery(sql, [guildId]);
        }
        
        return settings;
    }

    async updateSettings(guildId, settings) {
        const keys = Object.keys(settings);
        const updates = keys.map(key => `${key} = ?`).join(', ');
        const values = keys.map(key => settings[key]);
        
        const sql = `UPDATE settings SET ${updates} WHERE guild_id = ?`;
        return this.runUpdate(sql, [...values, guildId]);
    }

    async incrementTicketCounter(guildId) {
        const sql = 'UPDATE settings SET ticket_counter = ticket_counter + 1 WHERE guild_id = ?';
        await this.runUpdate(sql, [guildId]);
        
        const getSql = 'SELECT ticket_counter FROM settings WHERE guild_id = ?';
        const result = await this.runQuery(getSql, [guildId]);
        return result.ticket_counter;
    }

    // Blacklist methods
    async blacklistUser(userId, reason, bannedBy) {
        const sql = `
            INSERT OR REPLACE INTO blacklist (user_id, reason, banned_by)
            VALUES (?, ?, ?)
        `;
        return this.runUpdate(sql, [userId, reason, bannedBy]);
    }

    async unblacklistUser(userId) {
        const sql = 'DELETE FROM blacklist WHERE user_id = ?';
        return this.runUpdate(sql, [userId]);
    }

    async isBlacklisted(userId) {
        const sql = 'SELECT * FROM blacklist WHERE user_id = ?';
        return this.runQuery(sql, [userId]);
    }

    async getBlacklist() {
        const sql = 'SELECT * FROM blacklist';
        return this.runQueryAll(sql);
    }

    // Statistics
    async getStats(guildId) {
        const totalTickets = await this.runQuery('SELECT COUNT(*) as count FROM tickets');
        const openTickets = await this.runQuery('SELECT COUNT(*) as count FROM tickets WHERE status = "open"');
        const closedTickets = await this.runQuery('SELECT COUNT(*) as count FROM tickets WHERE status = "closed"');
        
        const topUsers = await this.runQueryAll(`
            SELECT user_id, COUNT(*) as ticket_count 
            FROM tickets 
            GROUP BY user_id 
            ORDER BY ticket_count DESC 
            LIMIT 5
        `);

        const topSupport = await this.runQueryAll(`
            SELECT claimed_by as user_id, COUNT(*) as claimed_count 
            FROM tickets 
            WHERE claimed_by IS NOT NULL 
            GROUP BY claimed_by 
            ORDER BY claimed_count DESC 
            LIMIT 5
        `);

        return {
            totalTickets: totalTickets.count,
            openTickets: openTickets.count,
            closedTickets: closedTickets.count,
            topUsers,
            topSupport
        };
    }
}
