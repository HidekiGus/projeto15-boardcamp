import connection from "../dbStrategy/postgres.js";
import joi from "joi";

//GET Customers - Envia lista de clientes

// POST Customers - Insere um cliente
export async function postCustomers(req, res) {
    try {
        const newCustomer = req.body;

        const customerSchema = joi.object({
            name: joi.string().required(),
            phone: joi.string().pattern(new RegExp(/^([0-9]{10}|[0-9]{11})$/)).required(),
            cpf: joi.string().pattern(new RegExp(/[0-9]{11}/)).required(),
            birthday: joi.string().required()
        })

        const { error } = customerSchema.validate(newCustomer);

        if (error) {
            return res.sendStatus(400);
        } else {
            const { rows: alreadyExists } = await connection.query(`SELECT * FROM customers WHERE cpf='${newCustomer.cpf}'`);
            if (alreadyExists.length === 0) {
                await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`,
                [newCustomer.name, newCustomer.phone, newCustomer.cpf, newCustomer.birthday]);
                return res.sendStatus(201);
            } else {
                return res.sendStatus(409);
            }
        }
    } catch(error) {
        res.sendStatus(500);
    }
}