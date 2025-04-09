import express from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  getOneProduct,
  findProductByName,
  findProductsByFilter,
  getProducts,
  getUserProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/", createProduct);

router.delete("/:id", deleteProduct);

router.put("/", updateProduct);

router.get("/search", findProductByName);

router.get("/filter", findProductsByFilter);

router.get("/products", getProducts);

router.get("/products/user", getUserProducts);

router.get("/:id", getOneProduct);

export default router;
