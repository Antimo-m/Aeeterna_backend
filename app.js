import express from "express";
import cors from "cors";
import connection from "./db/createConnection.js";
import productRouter from "./routers/product.js"
import errorHandler from "./middlewares/errorHandler.js";
import newOrderRouter from "./routers/newOrder.js";
import notFound from "./middlewares/notFound.js";
import sendEmail from "./mail/orderEmail.js";
import sendPopup from "./mail/popup.js";

const app = express();

app.use(express.static("public"));

const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors(
    { origin: process.env.FRONTEND_URL }));



app.get("/", (req, res) => {
    res.send("Aeeterna attivo");
});

app.use("/api/product", productRouter);
app.use("/api/neworder", newOrderRouter);
app.post("/api/sendemail", sendEmail);
app.post("/api/sendpopup", sendPopup);

app.use(errorHandler); //import global middlerware errorHandler

app.use(notFound);

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});


