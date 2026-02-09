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
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin: 0; padding: 0; background-color: #f7f9f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f9f7; padding: 20px;">
            <tr>
                <td align="center">
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; border: 1px solid ${brandColor}; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                        <tr>
                            <td style="background-color:"#9fad96"; padding: 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 1px;">AETERNA BEAUTY</h1>
                                <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Conferma d'acquisto</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">Gentile ${name},</h2>
                                <p style="margin: 0 0 20px 0; color: #555; line-height: 1.6; font-size: 15px;">
                                    Grazie per aver scelto <strong>Aeterna Beauty</strong>. Il tuo ordine è stato ricevuto con successo e sarà processato a breve.
                                </p>

                                <div style="border: 1px solid "; border-radius: 12px; padding: 20px; background-color: #fafafa;">
                                    <h3 style="margin: 0 0 15px 0; font-size: 14px; color:"#9fad96"; text-transform: uppercase;">Riepilogo Ordine #${invoiceId}</h3>
                                    ${products.map(product => `
                                        <table width="100%" style="border-bottom: 1px solid #eeeeee; margin-bottom: 10px; padding-bottom: 10px;">
                                            <tr>
                                                <td width="70"><img src="${baseUrl}/image/${product.image}" width="60" style="border-radius: 8px;"></td>
                                                <td style="font-size: 14px; color: #333; padding-left: 10px;"><strong>${product.name}</strong><br><span style="color: #888;">Quantità: ${product.quantity}</span></td>
                                                <td align="right" style="font-size: 14px; font-weight: bold; color:"#9fad96";">${product.price_at_purchase}€</td>
                                            </tr>
                                        </table>
                                    `).join('')}
                                    <table width="100%" style="margin-top: 15px;">
                                        <tr>
                                            <td style="font-size: 14px; color: #666;">Spedizione</td>
                                            <td align="right" style="font-size: 14px; color: #333;">${shipping_price}€</td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top:10px; font-size: 16px; font-weight: bold;">Totale</td>
                                            <td align="right" style="padding-top:10px; font-size: 18px; font-weight: bold; color: ${brandColor};">${total_price}€</td>
                                        </tr>
                                    </table>
                                </div>

                                <table width="100%" style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                                    <tr>
                                        <td align="center" style="font-size: 13px; color: #777; line-height: 1.5;">
                                            Se ti serve aiuto o maggiori informazioni contattaci:<br>
                                            <a href="mailto:assistenza@aeteralbeauty.it" style="color: ${brandColor}; text-decoration: none;">assistenza@aeteralbeauty.it</a> | <strong>4363263443265</strong>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #f9f9f9; padding: 30px; text-align: center;">
                                <p style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #333;">Seguici sui Social</p>
                                <a href="#" style="margin: 0 10px; text-decoration: none; color: ${brandColor};">Instagram</a>
                                <a href="#" style="margin: 0 10px; text-decoration: none; color: ${brandColor};">Facebook</a>
                                <p style="margin-top: 20px; font-size: 11px; color: #bbb;">© 2026 Aeterna Beauty - Forrest Gap - Tutti i diritti riservati</p>
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
                    to: "kigek96440@helesco.com",
                    subject: "Nuovo ordine ricevuto",
                    text: `Nuovo ordine creato da ${name} ${surname}. ID: ${invoiceId}`,
                    html:`
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
