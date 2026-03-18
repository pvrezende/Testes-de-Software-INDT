import { DataSource } from "typeorm";
import dotenv from 'dotenv'
import Pesquisador from "../entities/Pesquisador.js";
import RefreshToken from "../entities/RefreshToken.js";
import Area from "../entities/Area.js";
import { Sensor } from "../entities/Sensor.js";
import Leitura from "../entities/Leitura.js";

dotenv.config()

export const appDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT as string),
    username: process.env.DB_USER as string,
    password: process.env.DB_PASS as string,
    database: process.env.DB_NAME as string,

    entities: [Pesquisador, RefreshToken, Area, Sensor, Leitura],

    logging: true,
    synchronize: process.env.NODE_ENV !== "production",
});