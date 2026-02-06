import connection from "../db/createConnection.js";

function storeNewOrder(req, res, next) {
    const data = req.body;
    const { 
        name, surname, email, phone, city, country, street, postal_code, province, 
        products, total_price, shipping_price 
    } = data;

    // CAMPI OBBLIGATORI
    if (!name || !surname || !email || !city || !country || !street || !postal_code || !province) {
        return res.status(400).json({ error: "Aggiungi tutti i campi obbligatori" });
    }

    // VALIDAZIONI SPECIFICHE (Regex e Lunghezza)
    if (name.trim().length < 2 || surname.trim().length < 2) {
        return res.status(400).json({ error: "Nome e cognome devono contenere almeno 2 caratteri" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ error: "La mail inserita non è valida" });
    }

    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (phone && !phoneRegex.test(phone.trim())) { // Controllo telefono solo se fornito
        return res.status(400).json({ error: "Il numero di telefono non è valido" });
    }

    const postalCodeRegex = /^[A-Z0-9\s\-]{3,10}$/i;
    if (!postalCodeRegex.test(postal_code.trim())) {
        return res.status(400).json({ error: "Il codice postale non è valido" });
    }
    //VALIDAZIONE CARRELLO (Spostata qui!)
    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ 
            error: "Il carrello è vuoto, impossibile procedere con l'ordine" 
        });
    }
    //INSERIMENTO CLIENTE 
    const sqlCustomer = `INSERT INTO customers (name, surname, email, phone, city, country, street, postal_code, province)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const customerValues = [name, surname, email, phone, city, country, street, postal_code, province];

    connection.query(sqlCustomer, customerValues, (err, customerResult) => {
        if (err) return next(err);

        const newCustomerId = customerResult.insertId;

        //INSERIMENTO DATI FATTURA
        const sqlInvoice = `INSERT INTO invoices (id_customer, total_price, shipping_price, billing_street, billing_city, billing_country)  
                            VALUES (?, ?, ?, ?, ?, ?)`;
        
        connection.query(sqlInvoice, [newCustomerId, total_price, shipping_price, street, city, country], (err, invoiceResult) => {
            if (err) return next(err);

            const newInvoiceId = invoiceResult.insertId;

            const productInvoiceSql = `INSERT INTO product_invoice (id_product, id_invoice, quantity, price_at_purchase) VALUES (?, ?, ?, ?)`;
            let completed = 0;
            let hasError = false;

            products.forEach((curProduct) => {
                connection.query(
                    productInvoiceSql,
                    [curProduct.id_product, newInvoiceId, curProduct.quantity, curProduct.price_at_purchase],
                    (err) => {
                        if (err && !hasError ) {
                            hasError = true;
                            return next(err);
                        }
                        
                        completed++;
                        if (completed === products.length && !hasError) {

                            const sqlProducts = `
                            SELECT
                            products.name AS name,
                            products.image AS image,
                            product_invoice.quantity,
                            product_invoice.price_at_purchase 
                            FROM product_invoice
                            JOIN products
                            ON  products.id = product_invoice.id_product
                            WHERE product_invoice.id_invoice = ?
                            ` //forse qui bisogna aggiungere campi immagine prodotto e prezzo prodotto

                            connection.query(sqlProducts,[newInvoiceId], (err, invoice) => {
                                if (err) return next(err)
                                     req.body.invoiceId = newInvoiceId;
                            req.body.customerEmail = email;
                            req.body.products = invoice
                            // Usiamo l'email validata sopra
                            // Passiamo al middleware successivo (sendEmail)
                            next();
                            })
                           
                        }
                    }
                );
            });
        });
    });
}

export default { storeNewOrder };