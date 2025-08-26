import dayjs from "dayjs";
import { db } from "../database/database.connection.js";

export async function listRentals(req, res) {
    try {
        const result = await db.query(`
      SELECT 
        rentals.*,
        customers.id AS "customerId",
        customers.name AS "customerName",
        games.id AS "gameId",
        games.name AS "gameName"
      FROM rentals
      JOIN customers ON rentals."customerId" = customers.id
      JOIN games ON rentals."gameId" = games.id;
    `);

        const rentals = result.rows.map(rental => {
            return {
                id: rental.id,
                customerId: rental.customerId,
                gameId: rental.gameId,
                rentDate: rental.rentDate,
                daysRented: rental.daysRented,
                returnDate: rental.returnDate,
                originalPrice: rental.originalPrice,
                delayFee: rental.delayFee,
                customer: {
                    id: rental.customerId,
                    name: rental.customerName
                },
                game: {
                    id: rental.gameId,
                    name: rental.gameName
                }
            };
        });
        res.send(rentals);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function addRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const { pricePerDay } = res.locals;
    try {
        await db.query(
            `INSERT INTO rentals 
            ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate",  "delayFee")
            VALUES ($1, $2, $3, $4, $5, null, null);`,
            [customerId, gameId, daysRented, dayjs().format('YYYY-MM-DD'), pricePerDay * daysRented]);

        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function finalizeRental(req, res) {
    const { id } = req.params;
    const { pricePerDay, daysRented, rentDate } = res.locals;
    let delayFee = null;

    const difference = dayjs().diff(dayjs(rentDate), 'days');
    if (difference > daysRented) {
        delayFee = pricePerDay * (difference - daysRented);
    };

    try {
        await db.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;`, [dayjs().format('YYYY-MM-DD'), delayFee, id]);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }

};

export async function deleteRental(req, res) {
    const { id } = req.params;

    try {
        await db.query(`DELETE FROM rentals WHERE id = $1`, [id]);
        res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
};
