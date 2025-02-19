import express from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  getOneProduct,
  findProductByName,
  findProductsByFilter,
  getProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/products", createProduct);

router.delete("/products/:id", deleteProduct);

router.put("/products", updateProduct);

router.get("/products/:id", getOneProduct);

router.get("/search", findProductByName);

router.get("/filter", findProductsByFilter);

router.get("/products", getProducts);

export default router;
