import mysql2 from "mysql2"

import mysql2 from "mysql2"

const connection = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})


connection.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("connected to mysql")
    }
})



export default connection