import { db } from "../database/database.connection.js";

export async function listRentals(req, res){
    try {
        const rentals = await db.query(`SELECT * FROM rentals;`);
        res.send(rentals.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function addRental(req, res){

};


export async function finalizeRental(req, res){

};


export async function deleteRental(req, res){

};
