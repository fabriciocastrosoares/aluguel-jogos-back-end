import { db } from "../database/database.connection.js";

export async function listGames(req, res){
    try{
        const games = await db.query(`SELECT * FROM games;`);
        res.send(games.rows);
    } catch (err){
        res.status(500).send(err.message);
    }
};

export async function addGames(req, res){

};