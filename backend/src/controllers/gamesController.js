import connection from "../dbStrategy/postgres.js";
import joi from "joi";

// GET Games - Envia lista de jogos
export async function getGames(req, res) {
    try {
        const name = req.query.name;
        if (name) {
            const { rows: games } = await connection.query(`
            SELECT games.*, categories.id, categories.name as categoryName FROM games
            JOIN categories
            ON games."categoryId" = categories.id
            WHERE games.name ILIKE '${name}%';
            `)
            res.send(games).status(200);
        } else {
            const { rows: games } = await connection.query(`
            SELECT games.*, categories.id, categories.name as categoryName FROM games
            JOIN categories
            ON games."categoryId" = categories.id;
            `)
            res.send(games).status(200);
        }
    } catch(error) {
        return res.sendStatus(500);
    }
}

//POST Games - Insere um jogo
export async function postGames(req, res) {
    try {
        const newGame = req.body;

        const gameSchema = joi.object({
            name: joi.string().required(),
            image: joi.string().uri().required(),
            stockTotal: joi.number().greater(0).required(),
            categoryId: joi.number().required(),
            pricePerDay: joi.number().greater(0).required()
        });

        const { error } = gameSchema.validate(newGame);

        if (error) {
            return res.sendStatus(400);
        }

        const { rows: alreadyExists } = await connection.query(`
            SELECT * FROM games WHERE name='${newGame.name}';
        `);

        if (alreadyExists.length === 0) {
            await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);`,
                [newGame.name, newGame.image, newGame.stockTotal, newGame.categoryId, newGame.pricePerDay]
            );
            return res.sendStatus(201);
        } else {
            return res.sendStatus(409);
        }
    } catch(error) {
        return res.sendStatus(500);
    }
}