import express from "express";
import redirectMiddleware from "../middlewares/redirect.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

export const orderRouter = express.Router();
export const cartRouter = express.Router();

orderRouter.post("/", authenticateUser, redirectMiddleware);
orderRouter.get("/orders", authenticateUser, redirectMiddleware);
orderRouter.get("/:id", authenticateUser, redirectMiddleware);
orderRouter.delete("/:id", authenticateUser, redirectMiddleware);
orderRouter.put("/:id/status", authenticateUser, redirectMiddleware);

cartRouter.get("/", authenticateUser, redirectMiddleware);
cartRouter.post("/:id", authenticateUser, redirectMiddleware);
cartRouter.delete("/:id", authenticateUser, redirectMiddleware);
