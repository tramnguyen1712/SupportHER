const db = require('../db');

class Review{
    static async getByBusinessId(id){
        return await db.query("SELECT * FROM reviews WHERE business_id = ?", [id]);
    }

    static async create(businessId, userId, rating, comment){
        await db.query('INSERT INTO reviews (business_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [businessId, userId, rating, comment]
        );
    }
}

module.exports = Review