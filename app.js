import express from "express";
import cors from "cors";


const app = express()
const port = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Aeeterna attivo")
})


app.listen(port, () => {
    console.log(`Server running on ${port}`)
})