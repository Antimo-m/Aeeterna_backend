import express from "express";
import customerController from "../controllers/customerController.js";

const router = express.Router();

router.post("/", customerController.store)

export default router;