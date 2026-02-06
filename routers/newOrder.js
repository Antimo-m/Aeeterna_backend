import express from "express"
import controller from "../controllers/newOrderController.js"
import invoiceControll from "../middlewares/invoiceControll.js"
import sendEmail from "../mail/orderEmail.js";


const router = express.Router();

// STORE NEW ORDER
router.post("/",  invoiceControll, controller.storeNewOrder, sendEmail);


export default router