import transporter from "./trasporter.js";

function sendPopup(req, res, next) {
    console.log("Invio email...");

    const { email } = req.body;

    if (!email || typeof email != "string" ) {
        return res.status(400).json({ message: "Email mancante o non valida" });
    }


    const trim  = email.trim().toLowerCase()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(trim)){
        return res.status(400).json({
            message : "formato email non valido"
        })
    }

    transporter.sendMail(
        {
            from: process.env.MAIL_USER,
            to: trim,
            subject: "Benvenuto in famiglia",
            text: `Grazie per essere entrato nella nostra newsletter`,
            html: `
                <body>
                    <h3>Benvenuto in AeeTerna Skin</h3>
                    <h4>Resta connesso per scoprire tutte le novita</h4>
                </body>
                `
        }, (err) => {
            if (err) {
                console.error("Errore invio email", err)
                return res.status(500).json({ message: "Errore invio email, riprova più tardi" })
            }
            res.status(200).json({
                message: "Registrazione effettuata con successo"
            })
        }
    );
}

export default sendPopup;