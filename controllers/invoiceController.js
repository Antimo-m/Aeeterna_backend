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

      const productInvoice = `INSERT INTO product_invoice (id_product, id_invoice, quantity, price_at_purchase) VALUES (?,?,?,?)`;

      data.products.forEach((curProduct) => {
        connection.query(
          productInvoice,
          [
            curProduct.id_product,
            results.insertId,
            curProduct.quantity,
            curProduct.price_at_purchase,
          ],
          (err, resultProduct) => {
            if (err) return next(err);
          },
        );
      });
      res.status(201).json({
        message: "Ordine registrato con successo",
        invoiceId: results.insertId,
      });
    },
  );
}

export default { storeInvoice };
