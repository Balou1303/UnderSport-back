import dotenv from "dotenv";
import mysql2 from "mysql2/promise"

dotenv.config();

const bdd = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
})

export default bdd;