import connection from "./dbStrategy/postgres.js";
import express from "express";
import cors from "cors";
import joi from "joi";

const server = express();

server.use(cors());
server.use(express.json());

// GET Categories - Envia categorias
server.get('/categories', async (req, res) => {
    await connection.query('SELECT * FROM categories').then((categories) => {
        res.send(categories.rows);
    });
});

// POST Categories - Insere categoria nova
server.post('/categories', async(req, res) => {
    const newCategory = req.body;
    
    const categorySchema = joi.object({
        name: joi.string().required()
    });

    const { error } = categorySchema.validate(newCategory);

    if (error) {
        return res.sendStatus(400);
    }

    const { rows: alreadyExists } = await connection.query(
        `SELECT * FROM categories WHERE name=$1`, [
            newCategory.name
        ]
    );

    if (alreadyExists.length === 0) {
        await connection.query(
            `INSERT INTO categories (name) VALUES ($1);`, [
                newCategory.name
            ]
        );
        res.sendStatus(201);
    } else {
        return res.sendStatus(409);
    }
})

server.listen(4000, () => {
    console.log("Servidor rodando!");
});