import "reflect-metadata"
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";


import { appDataSource } from "./database/appDataSource.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";

import errorHandler from "./middleware/errorHandler.js";
import indexRouter from "./routes/index.routes.js";

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

// ADICIONADO: Export para permitir que os arquivos de teste (Supertest) acessem as rotas
export const app = express(); 

const PORT = process.env.PORT || 6060;

app.set('trust proxy', 1);

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
}));

app.use(helmet({
    contentSecurityPolicy: false
}));

app.use(cors({
  origin: FRONTEND_URL, // Usando a variável definida acima para maior flexibilidade
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan("dev"));
app.use(express.json());

app.use(compression({ threshold: 1024 }))

app.use('/api', indexRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
})

app.use(errorHandler)

// Tentando se conectar com o banco de dados
// Em ambiente de teste, o initialize() pode ser controlado pelo Vitest
appDataSource.initialize()
    .then(() => {
        console.log("Conectou com o banco!");

        // Garantimos que o servidor só escute na porta se não estivermos em ambiente de teste
        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                console.log(`Server is running in port: ${PORT}`)
            })
        }
    })
    .catch((error) => {
        console.log("Erro ao conectar no banco:", error)
    })