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

router.post("/", createProduct);

router.delete("/:id", deleteProduct);

router.put("/", updateProduct);

router.get("/:id", getOneProduct);

router.get("/search", findProductByName);

router.get("/filter", findProductsByFilter);

router.get("/", getProducts);

export default router;
