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

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);
        if (customer.rows.length === 0) return res.sendStatus(400);

        const game = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);
        if (game.rows.length === 0) return res.sendStatus(400);
        const gameData = game.rows[0];

        if (daysRented <= 0) return res.sendStatus(400);

        const openRentals = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL;`, [gameId]);
        if (openRentals.rows.length >= gameData.stockTotal) return res.sendStatus(400);

        const rentDate = new Date().toISOString().slice(0, 10);
        const originalPrice = daysRented * gameData.pricePerDay;

        await db.query(
            `INSERT INTO rentals 
            ("customerId", "gameId", "daysRented", "rentDate", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [customerId, gameId, daysRented, rentDate, null, originalPrice, null]
        );

        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message);
    }
};


export async function finalizeRental(req, res) {
    const { id } = req.params;

    try {
        const rentalResult = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
        if (rentalResult.rows.length === 0) return res.sendStatus(404);

        const rental = rentalResult.rows[0];

        if (rental.returnDate) return res.sendStatus(400);

        const gameResult = await db.query(`SELECT * FROM games WHERE id = $1;`, [rental.gameId]);
        const game = gameResult.rows[0];

        const today = new Date();
        const rentDate = new Date(rental.rentDate);
        const expectedReturn = new Date(rentDate);
        expectedReturn.setDate(expectedReturn.getDate() + rental.daysRented);

        let delayFee = 0;

        if (today > expectedReturn) {
            const delaysDays = Math.floor((today - expectedReturn) / (1000 * 60 * 60 * 24));
            delayFee = delaysDays * game.pricePerDay;
        };

        await db.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;`, [today, delayFee, id]);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }

};

export async function deleteRental(req, res) {
    const {id} = req.params;

    try{
        const rental = await db.query(`SELECT * FROM rentals   where id = $1;`, [id]);
        if(rental.rows.length === 0) return res.sendStatus(404);

        const [rentalExist] = rental.rows.map(r => r.returnDate);

        if(rentalExist === null) return res.sendStatus(400);
        
        await db.query(`DELETE FROM rentals WHERE id = $1`, [id]);
        res.sendStatus(200);        

    } catch (err) {
        res.status(500).send(err.message);
    }    
};
