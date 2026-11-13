const db = require('../db');

class Favorite {
    static async getByUserId(userId) {
        return await db.query(
            "SELECT b.*, f.date_saved FROM favorites f JOIN businesses b ON f.business_id = b.id WHERE f.user_id = ? ORDER BY f.date_saved DESC",
            [userId]
        );
    }

    static async create(userId, businessId) {
        await db.query(
            "INSERT INTO favorites (user_id, business_id) VALUES (?, ?)",
            [userId, businessId]
        );
    }

    static async delete(userId, businessId) {
        await db.query(
            "DELETE FROM favorites WHERE user_id = ? AND business_id = ?",
            [userId, businessId]
        );
    }

    static async exists(userId, businessId) {
        const rows = await db.query(
            "SELECT id FROM favorites WHERE user_id = ? AND business_id = ?",
            [userId, businessId]
        );
        return rows.length > 0;
    }
}

module.exports = Favorite;
