import express from "express";
import {
  createOrder,
  getOneOrder,
  getOrders,
  changeOrderStatus,
  deleteOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/order", createOrder);

router.get("/order", getOrders);

router.get("/order/:id", getOneOrder);

router.delete("/order/:id", deleteOrder);

router.put("/order/:id/status", changeOrderStatus);

export default router;
