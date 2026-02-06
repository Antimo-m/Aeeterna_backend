// export default function invoiceControll(req, res, next) {
//     const data = req.body;
//     console.log(data);
// if(data.billing_street == null || data.billing_city == null || data.billing_country == null){
//     return res.status(400).json({ message: "Errore nei dati di fatturazione" });
// } else {next()
// }}

export default function invoiceControll(req, res, next) {
    const { billing_street, billing_city, billing_country } = req.body;

    // Questo controlla se qualcuno di questi è nullo, indefinito o strnga vuota
    if (!billing_street || !billing_city || !billing_country) {
        return res.status(400).json({ 
            message: "Errore nei dati di fatturazione: tutti i campi sono obbligatori." 
        });
    }

    next();
}