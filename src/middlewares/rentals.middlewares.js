import { db } from "../database/database.connection.js";

export async function validateAddRental(req, res, next) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);
        if (customer.rows.length === 0) return res.sendStatus(400);

        const game = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);
        if (game.rows.length === 0) return res.sendStatus(400);

        if (daysRented <= 0) return res.sendStatus(400);

        const gameData = game.rows[0];
        const openRentals = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL;`, [gameId]);
        if (openRentals.rows.length >= gameData.stockTotal) return res.sendStatus(400);

        res.locals.pricePerDay = gameData.pricePerDay;
        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function validateFinalizaRental(req, res, next) {
    const { id } = req.params;

    try {
        const rentalResult = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
        if (rentalResult.rows.length === 0) return res.sendStatus(404);
        if (rentalResult.rows[0].returnDate !== null) return res.sendStatus(400);

        const { originalPrice, daysRented, rentDate } = rentalResult.rows[0];
        res.locals.pricePerDay = originalPrice / daysRented;
        res.locals.rentDate = rentDate;
        res.locals.daysRented = daysRented;

        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function validateDeleteRental(req, res, next) {
    const { id } = req.params;

    try {
        const rental = await db.query(`SELECT * FROM rentals   where id = $1;`, [id]);
        if (rental.rows.length === 0) return res.sendStatus(404);

        const [rentalExist] = rental.rows.map(r => r.returnDate);

        if (rentalExist === null) return res.sendStatus(400);
        next();
    } catch (err) {
        res.status(500).send(err.message);
    }

};