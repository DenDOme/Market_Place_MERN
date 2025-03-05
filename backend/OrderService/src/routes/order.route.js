import express from "express";
import {
  createOrder,
  getOneOrder,
  getOrders,
  changeOrderStatus,
  deleteOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", createOrder);

router.get("/orders", getOrders);

router.get("/:id", getOneOrder);

router.delete("/:id", deleteOrder);

router.put("/:id/status", changeOrderStatus);

export default router;
