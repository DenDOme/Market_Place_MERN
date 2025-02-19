import express from "express";
import {
  createOrder,
  getOneOrder,
  getOrders,
  changeOrderStatus,
  deleteOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/orders", createOrder);

router.get("/orders", getOrders);

router.get("/orders/:id", getOneOrder);

router.delete("/orders/:id", deleteOrder);

router.put("/orders/:id/status", changeOrderStatus);

export default router;
