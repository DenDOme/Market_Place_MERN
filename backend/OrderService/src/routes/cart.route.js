import express from "express";
import {
  getCart,
  addItemCart,
  deleteItemCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", getCart);

router.post("/:id", addItemCart);

router.delete("/:id", deleteItemCart);

export default router;
