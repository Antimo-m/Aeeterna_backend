import express from "express";
import cors from "cors";
import connection from "./db/createConnection.js"; 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors(
    { origin: process.env.FRONTEND_URL }));

app.get("/", (req, res) => {
    res.send("Aeeterna attivo");
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});


