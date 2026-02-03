import connection from "../db/createConnection.js";

function storeInvoice(req, res, next) {
  // Creiamo un nuovo oggetto ordine
  const data = req.body;

  // Aggiungiamo il nuovo ordine al database
  const query = `INSERT INTO invoices (id_customer, total_price, shipping_price, billing_street, billing_city, billing_country) 

VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(
    query,
    [
      data.id_customer,
      data.total_price,
      data.shipping_price,
      data.billing_street,
      data.billing_city,
      data.billing_country,
    ],
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.json({ message: "Ordine registrato con successo", invoiceId: results.insertId });
    },
  );
  
}

export default { storeInvoice };

