import { db } from "../database/database.connection.js";

export async function validateAddGame(req, res, next) {
    const { name } = req.body;
    try {
        const gameExists = await db.query(`SELECT * FROM games WHERE name = $1`, [name]);
        if (gameExists.rows.length > 0) return res.sendStatus(409);
        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
};