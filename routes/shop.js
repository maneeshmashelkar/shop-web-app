import express from "express";
import {
  getCart,
  getIndex,
  getOrders,
  getProduct,
  getProducts,
  postCart,
  postCartDeleteProduct,
  // postOrder,
  getInvoice,
  getCheckout,
  getCheckoutSuccess,
} from "../controllers/shop.js";
import { isAuth } from "../middleware/is-auth.js";

// import path from "path";
// import rootDir from "../util/path.js";
// import { products } from "./admin.js";

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCart);

router.post("/cart-delete-item", isAuth, postCartDeleteProduct);

router.get("/checkout", isAuth, getCheckout);

router.get("/checkout/success", getCheckoutSuccess);

router.get("/checkout/cancel", isAuth, getCheckout);

// router.post("/create-order", isAuth, postOrder);

router.get("/orders", isAuth, getOrders);

router.get("/orders/:orderId", isAuth, getInvoice);

// router.get("/checkout", getCheckout);

export default router;
