import express from "express";
import cors from "cors";

import categoriesRouter from "./routes/categoriesRouter.js";

const server = express();

server.use(cors());
server.use(express.json());

server.use(categoriesRouter);

server.listen(4000, () => {
    console.log("Servidor rodando!");
});