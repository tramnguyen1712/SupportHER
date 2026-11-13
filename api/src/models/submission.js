const db = require('../db');

class Submission {
    static async getAll() {
        return await db.query("SELECT * FROM submissions ORDER BY submitted_date DESC");
    }

    static async getById(id) {
        const rows = await db.query("SELECT * FROM submissions WHERE id = ?", [id]);
        return rows[0];
    }

    static async create(data) {
        const { name, address, city, state, zip, category, contact_email, contact_phone } = data;

        await db.query(
            "INSERT INTO submissions (name, address, city, state, zip, category, contact_email, contact_phone, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')",
            [name, address, city, state, zip, category, contact_email, contact_phone]
        );
    }

    static async updateStatus(id, status) {
        await db.query(
            "UPDATE submissions SET status = ? WHERE id = ?",
            [status, id]
        );
    }
}

module.exports = Submission;
