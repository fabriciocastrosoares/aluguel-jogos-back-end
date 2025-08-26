import { db } from "../database/database.connection.js";

export async function validateAddCustomer(req, res, next) {
    const { cpf } = req.body;
    try {
        const customerExists = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf]);
        if (customerExists.rows.length > 0) return res.sendStatus(409);
        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function validateUpdateCustomerId(req, res, next) {
    const { cpf } = req.body;
    const { id } = req.params;

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE cpf = $1 AND id <> $2;`, [cpf, id]);
        if (customer.rows.length > 0) return res.sendStatus(409);
        next();
    } catch (err) {
        res.status(500).send(err.message);
    }
};