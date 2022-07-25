import connection from "../dbStrategy/postgres.js";
import joi from "joi";
import dayjs from "dayjs";

//GET Customers - Envia lista de clientes
export async function getCustomers(req, res) {
    try {
        const day = dayjs();
        console.log(day);
        const { cpf } = req.query;
        const { id } = req.params;
        if (cpf) { // Se tiver cpf na query
            const { rows: customers } = await connection.query(`SELECT * FROM customers WHERE cpf LIKE '${cpf}%';`);
            return res.send(customers).status(200);
        } else { // Se não tiver cpf
            if (id) { // Se tiver id no params, busca por id
                const { rows: customers } = await connection.query(`SELECT * FROM customers WHERE id=${parseInt(id)};`);
                if (customers.length === 0) { // Se não encontra clientes com esse id
                    return res.sendStatus(404);
                } else { // Se encontra o cliente com esse id
                    return res.send(customers).status(200);
                }
            } else { // Se não tiver cpf nem id pega todos os customers
                const { rows: customers } = await connection.query(`SELECT * FROM customers;`);
                return res.send(customers).status(200);
            }
        }
    } catch(error) {
        return res.sendStatus(500);
    }
}

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

// PUT Customers - Atualiza um cliente
export async function putCustomers(req, res) {
    try {
        const { id } = req.params;
        const updateCustomer = req.body;

        const customerSchema = joi.object({
            name: joi.string().required(),
            phone: joi.string().pattern(new RegExp(/^([0-9]{10}|[0-9]{11})$/)).required(),
            cpf: joi.string().pattern(new RegExp(/[0-9]{11}/)).required(),
            birthday: joi.string().required()
        })

        const { error } = customerSchema.validate(updateCustomer);

        if (error) {
            return res.sendStatus(400);
        } else {
            const { rows: alreadyExists } = await connection.query(`SELECT * FROM customers WHERE cpf='${updateCustomer.cpf}'`);
            if (alreadyExists.length === 0) {
                await connection.query(`UPDATE customers 
                    SET name='${updateCustomer.name}',
                        phone='${updateCustomer.phone}',
                        cpf='${updateCustomer.cpf}',
                        birthday='${updateCustomer.birthday}'
                    WHERE id=${id};`
                );
                return res.sendStatus(201);
            } else {
                return res.sendStatus(409);
            }
        }
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
}