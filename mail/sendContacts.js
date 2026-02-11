import transporter from "./trasporter.js";

function sendContacts(req, res, next) {
    console.log("Invio email....");
    const { name, surname, description, email } = req.body

    if (name.length < 2 || surname.length < 2) {
        res.status(400).json({
            type: "error",
            message: "Nome e cognome devono contenere almeno 2 caratteri"
        })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        res.status(400).json({
            type: "error",
            message: "Email inserita non valida"
        })
    }

    if (description.length < 10) {
        res.status(400).json({
            type: "error",
            message: "Descrizione inserita non valida"
        })
    }

    const info = transporter.sendMail(
        {
            from: process.env.MAIL_USER,
            to: "stivenmastrovito6@gmail.com",
            subject: `Richiesta supporto`,
            text: `${name} ${surname}, ha avviato una chat di supporto.`,
            html: `
    <!DOCTYPE html>
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
                AETERNA BEAUTY
            </h1>
            <p style="margin:10px 0 0 0; color:#ffffff; font-size:15px; opacity:0.9;">
                Nuova richiesta di contatto
            </p>
        </td>
    </tr>

    <!-- BODY -->
    <tr>
        <td style="padding:40px 30px;">

            <h2 style="margin:0 0 25px 0; color:#333; font-size:20px;">
                Dettagli del cliente
            </h2>

            <!-- INFO BOX -->
            <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:30px;">
                <tr>
                    <td style="padding:15px; background-color:#fafafa; border-left:4px solid #d4b46a; border-radius:8px;">

                        <p style="margin:0 0 10px 0; font-size:14px; color:#555;">
                            <strong style="color:#9fad96;">Nome:</strong> ${name}
                        </p>

                        <p style="margin:0 0 10px 0; font-size:14px; color:#555;">
                            <strong style="color:#9fad96;">Cognome:</strong> ${surname}
                        </p>

                        <p style="margin:0; font-size:14px; color:#555;">
                            <strong style="color:#9fad96;">Email:</strong> ${email}
                        </p>

                    </td>
                </tr>
            </table>

            <!-- MESSAGGIO -->
            <h3 style="margin:0 0 15px 0; font-size:16px; color:#d4b46a; text-transform:uppercase; letter-spacing:1px;">
                Descrizione del problema
            </h3>

            <div style="background-color:#f9f9f9; padding:20px; border-radius:12px; border:1px solid #eeeeee;">
                <p style="margin:0; font-size:14px; color:#444; line-height:1.6; white-space:pre-line;">
                    ${description}
                </p>
            </div>

        </td>
    </tr>

    <!-- FOOTER -->
    <tr>
        <td style="background-color:#f9f9f9; padding:25px; text-align:center;">
            <p style="margin:0; font-size:12px; color:#999;">
                Questa email è stata inviata dal modulo contatti del sito Aeterna Beauty.
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
            if (err) return next(err)
            const info = transporter.sendMail(
                {
                    from: process.env.MAIL_USER,
                    to: email,
                    subject: `Richiesta supporto`,
                    text: `Richiesta inviata correttamente, risponderemo prima possibile`,
                    html: `
   <!DOCTYPE html>
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
                AETERNA BEAUTY
            </h1>
            <p style="margin:10px 0 0 0; color:#ffffff; font-size:15px; opacity:0.9;">
                Richiesta di supporto ricevuta
            </p>
        </td>
    </tr>

    <!-- BODY -->
    <tr>
        <td style="padding:40px 30px;">

            <h2 style="margin:0 0 20px 0; color:#333; font-size:20px;">
                Ciao ${name},
            </h2>

            <p style="margin:0 0 25px 0; color:#555; line-height:1.6; font-size:15px;">
                Abbiamo ricevuto la tua richiesta di supporto e il nostro team la sta già analizzando.
                Ti risponderemo il prima possibile all'indirizzo <strong>${email}</strong>.
            </p>

            <!-- BOX RIEPILOGO -->
            <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:30px;">
                <tr>
                    <td style="padding:18px; background-color:#fafafa; border-left:4px solid #d4b46a; border-radius:10px;">
                        <h3 style="margin:0 0 12px 0; font-size:14px; color:#d4b46a; text-transform:uppercase; letter-spacing:1px;">
                            Riepilogo della tua richiesta
                        </h3>

                        <p style="margin:0; font-size:14px; color:#444; line-height:1.6; white-space:pre-line;">
                            ${description}
                        </p>
                    </td>
                </tr>
            </table>

            <!-- INFO TEMPI -->
            <div style="background-color:#f9f9f9; padding:18px; border-radius:12px; border:1px solid #eeeeee;">
                <p style="margin:0; font-size:14px; color:#555; line-height:1.6;">
                    ⏳ <strong>Tempi di risposta:</strong> generalmente entro 24-48 ore lavorative.
                </p>
            </div>

            <p style="margin:30px 0 0 0; font-size:14px; color:#777; line-height:1.6;">
                Grazie per aver scelto <strong>Aeterna Beauty</strong>.<br>
                Siamo qui per aiutarti.
            </p>

        </td>
    </tr>

    <!-- FOOTER -->
    <tr>
        <td style="background-color:#f9f9f9; padding:25px; text-align:center;">
            <p style="margin:0 0 10px 0; font-size:13px; color:#777;">
                Se hai bisogno di ulteriore assistenza:
            </p>
            <p style="margin:0; font-size:13px;">
                <a href="mailto:assistenza@aeternabeauty.it" style="color:#9fad96; text-decoration:none;">
                    assistenza@aeternabeauty.it
                </a>
            </p>
            <p style="margin-top:20px; font-size:11px; color:#bbb;">
                © 2026 Aeterna Beauty - Tutti i diritti riservati
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
                },
            )
        }
    );

    res.json({
        message: "Richiesta di supporto inviata correttamenta",
    })
}

export default sendContacts