import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";


const app = express()
const port = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Aeeterna attivo")
})

app.use(errorHandler); //import global middlerware errorHandler

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})