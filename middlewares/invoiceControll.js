export default function invoiceControll(req, res, next) {
    const data = req.body;
    console.log(data);
if(data.billing_street == null || data.billing_city == null || data.billing_country == null){
    return res.status(400).json({ message: "Errore nei dati di fatturazione" });
} else {next()
}}