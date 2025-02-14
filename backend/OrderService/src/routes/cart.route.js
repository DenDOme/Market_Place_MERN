import express from 'express';

const router = express.Router();

router.get("/cart", getCart);

router.post("/cart/:id", addItemCart);

router.delete("/cart/:id", deleteItemCart);

export default router;