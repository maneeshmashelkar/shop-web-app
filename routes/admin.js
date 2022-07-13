import express from "express";
// import path from "path";
// import { title } from "process";
// import rootDir from "../util/path.js";
import {
  getAddProduct,
  getEditProduct,
  getProducts,
  postAddProduct,
  // postDeleteProduct,
  postEditProduct,
  deleteProduct,
} from "../controllers/admin.js";
import { isAuth } from "../middleware/is-auth.js";
import { body } from "express-validator";

const router = express.Router();

router.get("/add-product", isAuth, getAddProduct);

router.get("/products", isAuth, getProducts);

router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  postAddProduct
);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  postEditProduct
);

// router.post("/delete-product", isAuth, postDeleteProduct);

router.delete("/product/:productId", isAuth, deleteProduct);

export default router;
