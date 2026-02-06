import transporter from "./trasporter.js";

function sendEmail(req, res, next) {
    console.log("Invio email...");

    const { invoiceId, customerEmail, products } = req.body;

    if (!invoiceId) {
        return res.status(400).json({ error: "invoiceId mancante" });
    }
const baseUrl = `${req.protocol}://${req.get("host")}`;
    const info = transporter.sendMail(
        {
            from: process.env.MAIL_USER,
            to: customerEmail,
            subject: "Conferma ordine",
            text: `Il tuo ordine #${invoiceId} è stato ricevuto con successo`,
            html: `
                <body>
                   <h3 style="margin: 0 0 20px 0; font-family: Arial, sans-serif; font-size: 24px; color: #1a1a1a; text-align: center; line-height: 1.3;">
                    Il tuo ordine 
                    <span style="color: #BFA059; font-weight: 800;">#${invoiceId}</span> 
                    <br>è stato ricevuto con successo
                    </h3>
                    <section style="padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px; background-color: #ffffff;">
                        ${products
                    .map(product => {
                        const imageUrl = `${baseUrl}/image/${product.image}`;
                        console.log("Tentativo di caricamento immagine da:", imageUrl);
                        return`
                    <table role="presentation" width="100%" style="border-collapse: collapse; border-bottom: 1px solid #eeeeee; margin-bottom: 15px;">
                         <tr>
                            <td style="padding: 10px 0; width: 80px; vertical-align: middle;">
                            <img src="${imageUrl}" 
                                 alt="${product.name}" 
                                 width="70" 
                                 style="display: block; border-radius: 8px; border: 1px solid #f0f0f0; object-fit: cover;" />
                            </td>
        
                            <td style="padding: 10px 15px; vertical-align: middle;">
                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 16px; color: #333333; font-weight: bold;">
                              ${product.name}
                            </p>
                            <p style="margin: 5px 0 0 0; font-family: Arial, sans-serif; font-size: 14px; color: #888888;">
                              Quantità: ${product.quantity}
                            </p>
        </td>
        
        <td style="padding: 10px 0; text-align: right; vertical-align: middle;">
            <span style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; color: #2c3e50;">
                ${product.price_at_purchase}€
            </span>
        </td>
    </tr>
</table>
                            `})
                    .join("")}
                    </section>
                </body>
                `
        },
        (err) => {
            if (err) return next(err);
            console.log("to matteo");

            transporter.sendMail(
                {
                    from: process.env.MAIL_USER,
                    to: "kigek96440@helesco.com",
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
