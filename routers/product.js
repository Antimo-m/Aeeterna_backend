import express from "express"
import controller from "../controllers/productController.js"
import prova from "../controllers/fileindex.js";

const router = express.Router();




// INDEX BEST SELLER
router.get("/bestseller", controller.bestSeller);

// INDEX NEW ARRIVALS
router.get("/newarrivals", controller.newArrivals);

// INDEX PRODUCT
router.get("/", prova);



export default router
