import express from "express";
import cors from "cors";


const app = express()
const port = 3000

app.get("/", (req, res) => {
    res.send("Aeeterna attivo")
})


app.listen(port, () => {
    console.log(`Server running on ${port}`)
})