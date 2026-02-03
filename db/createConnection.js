import mysql2 from "mysql2";
import dotenv from "dotenv";

dotenv.config();

console.log("DB_HOST:", process.env.DB_HOST); 

const connection = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.log(" MySQL connection error:", err.message);
    } else {
        console.log(" Connected to MySQL");
    }
});

export default connection;
