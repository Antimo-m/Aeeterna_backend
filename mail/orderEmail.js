import transporter from "./trasporter.js";

function sendEmail(req, res, next) {
    console.log("Invio email...");

    const { invoiceId, customerEmail, products, name,
        surname,
        phone,
        street,
        city,
        postal_code,
        province,
        country,
        total_price,
        shipping_price } = req.body;



    if (!invoiceId) {
        return res.status(400).json({ error: "invoiceId mancante" });
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const info = transporter.sendMail(
        {
            from: process.env.MAIL_USER,
            to: customerEmail,
            subject: `Conferma ordine #${invoiceId} - Aeterna Beauty`,
            text: `Gentile ${name} ${surname}, grazie per il tuo ordine #${invoiceId}.`,
            html: `
    <html>
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0; padding:0; background-color:#f6f8f6; font-family:Helvetica, Arial, sans-serif;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:20px; background-color:#f6f8f6;">
<tr>
<td align="center">

<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:16px; border:1px solid #e6e6e6; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

    <!-- HEADER -->
    <tr>
        <td style="background-color:#9fad96; padding:30px; text-align:center;">
            <h1 style="margin:0; color:#ffffff; font-size:24px; letter-spacing:1px;">
                AETERNA SKIN
            </h1>
            <p style="margin:10px 0 0 0; color:#ffffff; font-size:15px; opacity:0.9;">
                Conferma del tuo ordine
            </p>
        </td>
    </tr>

    <!-- BODY -->
    <tr>
        <td style="padding:40px 30px;">

            <h2 style="margin:0 0 15px 0; color:#333; font-size:20px;">
                Grazie per il tuo acquisto, ${name} ${surname} ✨
            </h2>

            <p style="margin:0 0 25px 0; color:#555; line-height:1.6; font-size:15px;">
                Il tuo ordine è stato ricevuto correttamente.
                Ti invieremo aggiornamenti alla mail <strong>${customerEmail}</strong>.
            </p>

            <!-- ORDER ID -->
            <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:30px;">
                <tr>
                    <td style="padding:18px; background-color:#fafafa; border-left:4px solid #d4b46a; border-radius:10px;">
                        <h3 style="margin:0 0 10px 0; font-size:13px; color:#d4b46a; text-transform:uppercase; letter-spacing:1px;">
                            Numero Ordine
                        </h3>
                        <p style="margin:0; font-size:15px; color:#333; font-weight:600;">
                            #${invoiceId}
                        </p>
                    </td>
                </tr>
            </table>

            <!-- PRODOTTI -->
            <h3 style="margin:0 0 20px 0; font-size:16px; color:#333;">
                Riepilogo prodotti
            </h3>

            ${products.map(product => `
            <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:20px; border-bottom:1px solid #eeeeee; padding-bottom:15px;">
                <tr>
                    <td width="80" valign="top">
                        <img src="http://localhost:3000/image/${product.image}" width="70" style="border-radius:10px;" />
                    </td>
                    <td valign="top" style="padding-left:15px;">
                        <p style="margin:0; font-size:14px; font-weight:600; color:#333;">
                            ${product.name}
                        </p>
                        <p style="margin:5px 0 0 0; font-size:13px; color:#777;">
                            Quantità: ${product.quantity}
                        </p>
                        <p style="margin:5px 0 0 0; font-size:13px; color:#777;">
                            € ${parseFloat(product.price_at_purchase).toFixed(2)}
                        </p>
                    </td>
                </tr>
            </table>
            `).join('')}

            <!-- TOTALI -->
            <table width="100%" cellspacing="0" cellpadding="0" style="margin-top:30px;">
                <tr>
                    <td style="padding:15px 0; font-size:14px; color:#555;">
                        Spedizione:
                    </td>
                    <td align="right" style="font-size:14px; color:#555;">
                       ${parseInt(total_price) >= 45 ? 0.00 : 4.99} € 
                    </td>
                </tr>
                <tr>
                    <td style="padding:10px 0; font-size:16px; font-weight:600; color:#333;">
                        Totale:
                    </td>
                    <td align="right" style="font-size:16px; font-weight:600; color:#333;">
                         ${parseFloat(total_price).toFixed(2)} €
                    </td>
                </tr>
            </table>

            <!-- INDIRIZZO -->
            <table width="100%" cellspacing="0" cellpadding="0" style="margin-top:35px;">
                <tr>
                    <td style="padding:18px; background-color:#f9f9f9; border-radius:12px; border:1px solid #eeeeee;">
                        <h3 style="margin:0 0 10px 0; font-size:13px; color:#d4b46a; text-transform:uppercase; letter-spacing:1px;">
                            Indirizzo di spedizione
                        </h3>
                        <p style="margin:0; font-size:14px; color:#555; line-height:1.6;">
                            ${street}<br>
                            ${postal_code} ${city} (${province})<br>
                            ${country}<br>
                            Tel: ${phone}
                        </p>
                    </td>
                </tr>
            </table>

            <p style="margin:30px 0 0 0; font-size:14px; color:#777; line-height:1.6;">
                Grazie per aver scelto <strong>Aeterna Skin</strong>.<br>
                La tua bellezza è un percorso, e noi siamo felici di farne parte.
            </p>

        </td>
    </tr>

    <!-- FOOTER -->
    <tr>
        <td style="background-color:#f9f9f9; padding:25px; text-align:center;">
            <p style="margin:0 0 10px 0; font-size:13px; color:#777;">
                Per assistenza sul tuo ordine:
            </p>
            <p style="margin:0; font-size:13px;">
                <a href="mailto:assistenza@aeternaskin.it" style="color:#9fad96; text-decoration:none;">
                    assistenza@aeternaskin.it
                </a>
            </p>
            <p style="margin-top:20px; font-size:11px; color:#bbb;">
                © 2026 Aeterna Skin - Tutti i diritti riservati
            </p>
        </td>
    </tr>

</table>

</td>
</tr>
</table>

</body>
</html>`
        },
        (err) => {
            if (err) return next(err);
            console.log("to matteo");

            transporter.sendMail(
                {
                    from: process.env.MAIL_USER,
                    to: "l.summa94@gmail.com",
                    subject: "Nuovo ordine ricevuto",
                    text: `Nuovo ordine creato da ${name} ${surname}. ID: ${invoiceId}`,
                    html: `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0; padding:0; background-color: #f0f0f0; font-family: sans-serif;">
        <table width="100%" style="padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" style="background:#fff; border: 2px solid #333; border-radius: 12px; padding: 30px;">
                        <tr><td>
                            <h2 style="color: #9fad96; border-bottom: 2px solid #eee; padding-bottom: 10px;">🔔 NUOVO ORDINE #${invoiceId}</h2>
                            <p>Il cliente <strong>${name} ${surname}</strong> ha appena confermato un ordine.</p>
                            
                            <h4 style="margin-bottom:5px;">Dati di spedizione:</h4>
                            <p style="font-size: 14px; background: #f9f9f9; padding: 15px; border-radius: 8px;">
                                ${name} ${surname}<br>
                                ${street}, ${postal_code} ${city} (${province})<br>
                                ${country}<br>
                                Tel: ${phone || 'Non fornito'}<br>
                                Email: ${customerEmail}
                            </p>

                            <h4>Prodotti ordinati:</h4>
                            ${products.map(product => `<p style="font-size: 14px;">• ${product.name} (x${product.quantity}) - ${product.price_at_purchase}€</p>`).join('')}
                            <hr style="border: 0; border-top: 1px solid #eee;">
                            <p style="font-size: 14px;">Costo Spedizione: ${shipping_price}€</p>
                            <p style="font-size: 18px; color: #9fad96;"><strong>Totale Ordine: ${total_price}€</strong></p>
                        </td></tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`
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
