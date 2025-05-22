import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "user_access_management",
    synchronize: true,
    logging: true,
    entities: [path.join(__dirname, "../entity/**/*.{ts,js}")],
    migrations: [path.join(__dirname, "../migration/**/*.{ts,js}")],
    subscribers: [path.join(__dirname, "../subscriber/**/*.{ts,js}")],
}); 