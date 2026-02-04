import transporter from "./trasporter.js";

function sendEmail(req, res, next) {
    console.log("Invio email...");

    const { invoiceId, products } = req.body;

    if (!invoiceId) {
        return res.status(400).json({ error: "invoiceId mancante" });
    }

    const info = transporter.sendMail(
        {
            from: process.env.MAIL_USER,
            to: "kigek96440@helesco.com",
            subject: "Conferma ordine",
            text: `Il tuo ordine #${invoiceId} è stato ricevuto con successo`,
            html: `
                <body>
                    <h3>Il tuo ordine #${invoiceId} è stato ricevuto con successo</h3>
                  <div>
                   ${products
                    .map(product => `<section>${product.name}</section>`)
                    .join("")}
                 </div>
                </body>
                `
        },
        (err) => {
            if (err) return next(err);
            console.log("to matteo");

            transporter.sendMail(
                {
                    from: process.env.MAIL_USER,
                    to: customerEmail,
                    subject: "Nuovo ordine ricevuto",
                    text: `Nuovo ordine creato. ID ordine: ${invoiceId}`
                },
                (err) => {
                    if (err) return next(err);

                    res.json({
                        message: "Email inviate con successo"
                    });
                }
            );
        }
    );

}

export default sendEmail;
