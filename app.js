import express from "express";
import cors from "cors";


const app = express()
const port = process.env.PORT;

app.use(
    cors({
        origin: "http://localhost:5173",
    }),
);

app.get("/", (req, res) => {
    res.send("Aeeterna attivo")
})


app.listen(port, () => {
    console.log(`Server running on ${port}`)
})