import connection from "../db/createConnection.js";

function store(req, res, next) {
    console.log(req.body);

    const { name, surname, email, phone, city, country, street, postal_code, province } = req.body;

    // CAMPI OBBLIGATORI
    if (!name || !surname || !email || !city || !country || !street || !postal_code || !province) {
        return res.status(400).json({
            error: "Aggiungi tutti i campi obbligatori"
        })
    }

    // CONTROLLO NOME
    if (name.trim().length < 2) {
        return res.status(400).json({
            error: "Il  nome deve contenere almeno 2 caratteri"
        })
    }

    // CONTROLLO COGNOME
    if (surname.trim().length < 2) {
        return res.status(400).json({
            error: "Il cognome deve contenere almeno 2 caratteri"
        })
    }

    // CONTROLLO EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
            error: "La mail che hai inserito non è valida"
        })
    }

    // CONTROLLO NUMERO TELEFONICO
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (!phoneRegex.test(phone.trim())) {
        return res.status(400).json({
            error: "Il numero di telefono che hai inserito non è valido"
        });
    }

    // CONTROLLO CITTA
    if (city.trim().length < 2) {
        return res.status(400).json({
            error: "La città deve contenere almeno 2 caratteri"
        })
    }

    // CONTROLLO PAESE
    if (country.trim().length < 2) {
        return res.status(400).json({
            error: "La città deve contenere almeno 2 caratteri"
        })
    }
    const countryRegex = /^[a-zA-ZÀ-ÿ\s\-]{2,}$/;
    if (!countryRegex.test(country.trim())) {
        return res.status(400).json({
            error: "Il paese che hai inserito non è valido"
        });
    }

    // CONTROLLO VIA
    if (street.trim().length < 3) {
        return res.status(400).json({
            error: "La via deve contenere almeno 3 caratteri"
        })
    }
    const streetRegex = /^[a-zA-ZÀ-ÿ0-9\s,.'\/\-]{3,}$/;
    if (!streetRegex.test(street.trim())) {
        return res.status(400).json({
            error: "La via che hai inserito non è valida"
        });
    }

    // CONTROLLO CODICE POSTALE
    const postalCodeRegex = /^[A-Z0-9\s\-]{3,10}$/i;
    if (!postalCodeRegex.test(postal_code.trim())) {
        return res.status(400).json({
            error: "Il codice postale che hai inserito non è valido"
        });
    }

    // CONTROLLO PROVINCIA
    if (province.trim().length < 2) {
        return res.status(400).json({
            error: "La provincia deve contenere almeno 2 caratteri"
        })
    }


    const sql = `INSERT INTO customers (name, surname, email, phone, city, country, street, postal_code, province)
    VALUES (?, ? , ?, ?, ?, ?, ?, ?, ?)`;

    const values = [name, surname, email, phone, city, country, street, postal_code, province];


    connection.query(sql, values, (err, result) => {
        if (err) return next(err);

        res.status(201).json({
            message: "utente creato",
            id: result.insertId
        })
    })
}

const controller = {
    store
}

export default controller;