import connection from "../dbStrategy/postgres.js";
import joi from "joi";
import dayjs from "dayjs";

// GET Rentals
export async function getRentals(req, res) {
    try {
        const { customerId, gameId } = req.query;
        const { rows: data } = await connection.query(`
            SELECT rentals.*, customers.name as "customerName", customers.id, games.name as "gameName", games."categoryId" as "gamesCategoryId", categories.name as "categoryName" FROM rentals
            JOIN customers
            ON rentals."customerId"=customers.id
            JOIN games
            ON rentals."gameId"=games.id
            JOIN categories
            ON games."categoryId"=categories.id
            ${customerId ? `WHERE rentals."customerId"=${customerId}` : ''}
            ${gameId ? customerId && gameId ? `AND rentals."gameId"=${gameId}` : `WHERE rentals."gameId"=${gameId}` : ''}
            ;`
            );

        const arrayWithCustomerAndGame = data.map((item) => {
            const obj = {
                ...item,
                customer: {
                    id: item.customerId,
                    name: item.customerName
                },
                game: {
                    id: item.gameId,
                    name: item.gameName,
                    categoryId: item.gamesCategoryId,
                    categoryName: item.categoryName
                }
            };

            delete obj.customerName;
            delete obj.gameName;
            delete obj.gamesCategoryId;
            delete obj.categoryName;

            return obj;
        });
        res.send(arrayWithCustomerAndGame).status(201);
    } catch(error) {
        console.log(error)
        return res.sendStatus(500);
    }
}

// POST Rentals
export async function postRentals(req, res) {
    try {
        const newRental = req.body;

        const rentalSchema = joi.object({
            customerId: joi.number().required(),
            gameId: joi.number().required(),
            daysRented: joi.number().required()
        });

        const { error } = rentalSchema.validate(newRental);

        if (error) {
            return res.sendStatus(400);
        }

        const { rows: customerIdExistsData } = await connection.query(`SELECT EXISTS(SELECT * FROM customers WHERE id=${newRental.customerId});`);
        const customerIdExists = customerIdExistsData[0].exists; // Pega o boolean dentro do resultado da query acima
        const { rows: gameIdExistsData } = await connection.query(`SELECT EXISTS(SELECT * FROM games WHERE id=${newRental.gameId});`);
        const gameIdExists = gameIdExistsData[0].exists; // Pega o boolean dentro do resultado da query acima
        const { rows: rentedGamesData } = await connection.query(`SELECT * FROM rentals WHERE "returnDate" IS NULL AND "gameId"=${newRental.gameId};`);
        const { rows: gameStockData } = await connection.query(`SELECT * FROM games WHERE id=${newRental.gameId}`);
        const rentedGames = rentedGamesData.length;
        const gameStock = gameStockData[0].stockTotal;

        if ((!customerIdExists) || (!gameIdExists) || (newRental.daysRented <= 0) || (rentedGames >= gameStock)) {
            return res.sendStatus(400);
        } else  {    
            const now = dayjs().format("YYYY-MM-DD");
            const { rows: game } = await connection.query(`SELECT * FROM games WHERE id=${newRental.gameId};`);
            const originalPrice = parseInt(game[0].pricePerDay) * parseInt(newRental.daysRented);
            await connection.query( `INSERT INTO rentals (
                                    "customerId",
                                    "gameId",
                                    "rentDate",
                                    "daysRented",
                                    "returnDate",
                                    "originalPrice",
                                    "delayFee")
                                    VALUES (
                                    ${newRental.customerId},
                                    ${newRental.gameId},
                                    '${now}',
                                    ${newRental.daysRented},
                                    null,
                                    ${originalPrice},
                                    null)`
            );
            return res.sendStatus(201);
        }
    } catch(error) {
        return res.sendStatus(500);
    }
}

