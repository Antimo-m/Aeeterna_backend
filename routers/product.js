import express from "express"
import controller from "../controllers/productController.js"

const router = express.Router();




// INDEX BEST SELLER
router.get("/bestseller", controller.bestSeller);

// INDEX NEW ARRIVALS
router.get("/newarrivals", controller.newArrivals);

// SHOW CON SLUG
router.get("/:slug",controller.showWithSlug)

// INDEX PRODUCT
router.get("/", controller.index);





export default router
