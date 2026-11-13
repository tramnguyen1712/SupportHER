const crypto = require("crypto");
const db = require("../db")

module.exports = class User {
    id = null;
    username = null;
    #passwordHash = null;
    #salt = null;

    constructor(data){
        this.id = data.id;
        this.username = data.username;
        this.#passwordHash = data.password_hash;
        this.#salt = data.salt;
    }


    static async create(username, password) {
        const salt = crypto.randomBytes(16).toString("hex");

        const hash = await new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) {
                    reject("Error: " + err);
                } else {
                    resolve(derivedKey.toString("hex"));
                }
            });
        });

        await db.query("INSERT INTO users(username, password_hash, salt) VALUES (?, ?, ?)",
            [username, hash, salt]);
    }

    static async findByUsername(username){
        const rows = await db.query("SELECT * FROM users WHERE username = ?", [username]);

        if(!rows[0]){
            return null;
        }

        return new User(rows[0]);
    }

    validatePassword(password){
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, this.#salt, 100000, 64, "sha512", (err, derivedKey) => {
                if(err){
                    reject("Error: " + err);
                }

                const hash = derivedKey.toString("hex");

                if(hash === this.#passwordHash){
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }
};