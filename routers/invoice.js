import express from "express"
import controller from "../controllers/invoiceController.js"
import invoiceControll from "../middlewares/invoiceControll.js"

const router = express.Router();

// STORE INVOICES
router.post("/",  invoiceControll, controller.storeInvoice);


export default router
