import transporter from "./trasporter.js";

function sendPopup(req, res, next) {
    console.log("Invio email...");

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "email mancante" });
    }

    transporter.sendMail(
        {
            from: process.env.MAIL_USER,
            to: email,
            subject: "Benvenuto in famiglia",
            text: `Grazie per essere entrato nella nostra newsletter`,
            html: `
                <body>
                    <h3>Benvenuto in AeeTerna Skin</h3>
                    <h4>Resta connesso per scoprire tutte le novita</h4>
                </body>
                `
        });

        res.status(200).json({
            message: "Registrazione effettuata con successo"
        })


}

export default sendPopup;