import connection from "../db/createConnection.js";

function store(req, res, next) {
    console.log(req.body);

    const { name, surname, email, phone, city, country, street, postal_code, province } = req.body;


    const sql = `INSERT INTO customers (name, surname, email, phone, city, country, street, postal_code, province)
    VALUES (?, ? , ?, ?, ?, ?, ?, ?, ?)`;

    const values = [name, surname, email, phone, city, country, street, postal_code, province];


    connection.query(sql, values, (err, result) => {
        if (err) return next(err);

        res.status(201).json({
            message: "customer create",
            id: result.insertId
        })
    })
}

const controller = {
    store
}

export default controller;