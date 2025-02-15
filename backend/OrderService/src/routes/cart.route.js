import express from 'express';
import { getCart, addItemCart, deleteItemCart } from '../controllers/cart.controller.js';

const router = express.Router();

router.get("/cart", getCart);

router.post("/cart/:id", addItemCart);

router.delete("/cart/:id", deleteItemCart);

export default router;