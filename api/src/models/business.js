const db = require('../db');

class Business {
    static async getAll(){
        return await db.query("SELECT * FROM businesses");
    }

    static async create(data){
        const{name, address, city, state, zip} = data;

        await db.query("INSERT INTO businesses (name, address, city, state, zip) VALUES (?, ?, ?, ?, ?)",
            [name, address, city, state, zip]);
    }

    static async getById(id){
        const rows = await db.query("SELECT * FROM businesses WHERE id = ?", [id]);

        return rows[0];
    }
}

module.exports = Business;