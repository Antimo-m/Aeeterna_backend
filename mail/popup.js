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
                Benvenuto nella nostra Newsletter
            </p>
        </td>
    </tr>

    <!-- BODY -->
    <tr>
        <td style="padding:40px 30px;">

            <p style="margin:0 0 25px 0; color:#555; line-height:1.6; font-size:15px;">
                Grazie per esserti iscritto alla newsletter di <strong>Aeterna Skin</strong>.
                Hai scelto di prenderti cura della tua pelle con consapevolezza e qualità.
            </p>

            <!-- BOX VALORE -->
            <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:30px;">
                <tr>
                    <td style="padding:20px; background-color:#fafafa; border-left:4px solid #d4b46a; border-radius:10px;">
                        <h3 style="margin:0 0 12px 0; font-size:14px; color:#d4b46a; text-transform:uppercase; letter-spacing:1px;">
                            Cosa riceverai
                        </h3>

                        <p style="margin:0; font-size:14px; color:#444; line-height:1.8;">
                            • Consigli personalizzati per la cura della pelle<br>
                            • Approfondimenti sui nostri ingredienti<br>
                            • Novità e lanci esclusivi<br>
                            • Offerte riservate alla community
                        </p>
                    </td>
                </tr>
            </table>

            <!-- CTA -->
            <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:30px;">
                <tr>
                    <td align="center">
                        <a href="http://localhost:5173" 
                           style="background-color:#d4b46a; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:12px; font-weight:600; font-size:14px; display:inline-block; letter-spacing:0.5px;">
                            SCOPRI AETERNA SKIN
                        </a>
                    </td>
                </tr>
            </table>

            <div style="background-color:#f9f9f9; padding:18px; border-radius:12px; border:1px solid #eeeeee;">
                <p style="margin:0; font-size:14px; color:#555; line-height:1.6;">
                    ✨ La bellezza autentica non è una promessa immediata, ma un percorso nel tempo.
                </p>
            </div>

            <p style="margin:30px 0 0 0; font-size:14px; color:#777; line-height:1.6;">
                Grazie per essere entrato nella nostra community.<br>
                Il tuo viaggio con <strong>Aeterna Skin</strong> inizia ora.
            </p>

        </td>
    </tr>

    <!-- FOOTER -->
    <tr>
        <td style="background-color:#f9f9f9; padding:25px; text-align:center;">
            <p style="margin:0 0 10px 0; font-size:13px; color:#777;">
                Hai domande? Siamo qui per te:
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
</html>
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