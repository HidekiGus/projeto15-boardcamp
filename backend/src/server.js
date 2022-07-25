import express from "express";
import cors from "cors";

import categoriesRouter from "./routes/categoriesRouter.js";
import gamesRouter from "./routes/gamesRouter.js";
import customersRouter from "./routes/customersRouter.js";

const server = express();

server.use(cors());
server.use(express.json());

server.use(categoriesRouter);
server.use(gamesRouter);
server.use(customersRouter);

server.listen(4000, () => {
    console.log("Servidor rodando!");
});