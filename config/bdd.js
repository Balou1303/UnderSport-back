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

bdd.getConnection()
try {
    console.log("database ok ✅​");
    
} catch (error) {
    console.error("database ko ❌​");
    
}

export default bdd;