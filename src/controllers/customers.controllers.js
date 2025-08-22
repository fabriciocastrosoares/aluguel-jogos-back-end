import { db } from "../database/database.connection.js";


export async function listCustomers(req, res) {
    try {
        const customers = await db.query(`SELECT * FROM customers;`);
        res.send(customers.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }

};

export async function getCustomerId(req, res) {
    const { id } = req.params;

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);
        if (customer.rows.length === 0) return res.sendStatus(404);

        res.send(customer.rows[0]);

    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function addCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const customerExists = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf]);
        if (customerExists.rows.length > 0) return res.sendStatus(409);

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday]);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function updateCustomerId(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE cpf = $1 AND id <> $2;`, [cpf, id]);
        if (customer.rows.length > 0) return res.sendStatus(409);

        await db.query(`UPDATE customers SET name = $1 , phone = $2, cpf = $3, birthday = $4  WHERE id = $5;`, [name, phone, cpf, birthday, id]);
        res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }

};
