const db = require('../db');

class Event {
    static async getAll() {
        return await db.query("SELECT * FROM events ORDER BY date ASC");
    }

    static async getById(id) {
        const rows = await db.query("SELECT * FROM events WHERE id = ?", [id]);
        return rows[0];
    }

    static async create(data) {
        const { title, date, time, location, address, description, details } = data;

        await db.query(
            "INSERT INTO events (title, date, time, location, address, description, details) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [title, date, time, location, address, description, details]
        );
    }

    static async getSavedByUserId(userId) {
        return await db.query(
            `SELECT e.*, es.date_saved
             FROM event_saves es
             JOIN events e ON es.event_id = e.id
             WHERE es.user_id = ?
             ORDER BY es.date_saved DESC`,
            [userId]
        );
    }

    static async saveEvent(userId, eventId) {
        await db.query(
            "INSERT INTO event_saves (user_id, event_id) VALUES (?, ?)",
            [userId, eventId]
        );
    }

    static async unsaveEvent(userId, eventId) {
        await db.query(
            "DELETE FROM event_saves WHERE user_id = ? AND event_id = ?",
            [userId, eventId]
        );
    }

    static async isSaved(userId, eventId) {
        const rows = await db.query(
            "SELECT id FROM event_saves WHERE user_id = ? AND event_id = ?",
            [userId, eventId]
        );

        return rows.length > 0;
    }
}

module.exports = Event;
