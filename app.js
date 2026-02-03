import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";


const app = express()
const port = 3000

app.get("/", (req, res) => {
    res.send("Aeeterna attivo")
})

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})