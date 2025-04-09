import express from "express";
import redirectMiddleware from "../middlewares/redirect.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

export const categoryRouter = express.Router();
export const favouriteRouter = express.Router();
export const productRouter = express.Router();
export const reviewRouter = express.Router();
export const userActionRouter = express.Router();

categoryRouter.post("/", authenticateUser, redirectMiddleware);
categoryRouter.get("/categories", redirectMiddleware);
categoryRouter.get("/:id", redirectMiddleware);
categoryRouter.put("/:id", authenticateUser, redirectMiddleware);
categoryRouter.delete("/:id", authenticateUser, redirectMiddleware);

favouriteRouter.post("/", authenticateUser, redirectMiddleware);
favouriteRouter.get("/favourites", authenticateUser, redirectMiddleware);
favouriteRouter.get("/:id", authenticateUser, redirectMiddleware);
favouriteRouter.delete("/:id", authenticateUser, redirectMiddleware);

productRouter.post("/", authenticateUser, redirectMiddleware);
productRouter.delete("/:id", authenticateUser, redirectMiddleware);
productRouter.put("/", authenticateUser, redirectMiddleware);
productRouter.get("/:id", redirectMiddleware);
productRouter.get("/search", redirectMiddleware);
productRouter.get("/filter", redirectMiddleware);
productRouter.get("/products", redirectMiddleware);
productRouter.get("/products/user", authenticateUser, redirectMiddleware);

reviewRouter.post("/", authenticateUser, redirectMiddleware);
reviewRouter.get("/:id", redirectMiddleware);
reviewRouter.delete("/:id", authenticateUser, redirectMiddleware);

userActionRouter.post("/", authenticateUser, redirectMiddleware);
