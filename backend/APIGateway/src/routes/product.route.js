import express from "express";
import redirectMiddleware from "../middlewares/redirect.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

export const categoryRouter = express.Router();
export const favouriteRouter = express.Router();
export const productRouter = express.Router();
export const reviewRouter = express.Router();
export const userActionRouter = express.Router();

categoryRouter.post("/", authenticateUser, redirectMiddleware);
categoryRouter.get("/categories", authenticateUser, redirectMiddleware);
categoryRouter.get("/:id", authenticateUser, redirectMiddleware);
categoryRouter.put("/:id", authenticateUser, redirectMiddleware);
categoryRouter.delete("/:id", authenticateUser, redirectMiddleware);

favouriteRouter.post("/", authenticateUser, redirectMiddleware);
favouriteRouter.get("/favourites", authenticateUser, redirectMiddleware);
favouriteRouter.get("/:id", authenticateUser, redirectMiddleware);
favouriteRouter.delete("/:id", authenticateUser, redirectMiddleware);

productRouter.post("/", authenticateUser, redirectMiddleware);
productRouter.delete("/:id", authenticateUser, redirectMiddleware);
productRouter.put("/", authenticateUser, redirectMiddleware);
productRouter.get("/:id", authenticateUser, redirectMiddleware);
productRouter.get("/search", authenticateUser, redirectMiddleware);
productRouter.get("/filter", authenticateUser, redirectMiddleware);
productRouter.get("/products", authenticateUser, redirectMiddleware);

reviewRouter.post("/", authenticateUser, redirectMiddleware);
reviewRouter.get("/:id", authenticateUser, redirectMiddleware);
reviewRouter.delete("/:id", authenticateUser, redirectMiddleware);

userActionRouter.post("/", authenticateUser, redirectMiddleware);
