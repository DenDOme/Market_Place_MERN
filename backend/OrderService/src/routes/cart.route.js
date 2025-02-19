import express from "express";
import {
  getCart,
  addItemCart,
  deleteItemCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/carts", getCart);

router.post("/carts/:id", addItemCart);

router.delete("/carts/:id", deleteItemCart);

export default router;
