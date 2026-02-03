import express from "express";
import cors from "cors";
import connection from "./db/createConnection.js";
import productRouter from "./routers/product.js"
import customerRouter from "./routers/customer.js"
import errorHandler from "./middlewares/errorHandler.js";
import invoiceRouter from "./routers/invoice.js";

const app = express();

const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors(
    { origin: process.env.FRONTEND_URL }));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Aeeterna attivo");
});

app.use("/api/product", productRouter);
app.use("/api/invoice", invoiceRouter);
app.use("/api/customer", customerRouter);
app.use(errorHandler); //import global middlerware errorHandler

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});


