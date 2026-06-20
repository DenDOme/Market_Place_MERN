import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import {
  categoryRouter,
  favouriteRouter,
  productRouter,
  reviewRouter,
  userActionRouter,
} from "./routes/product.route.js";

import { orderRouter, cartRouter } from "./routes/order.route.js";

dotenv.config();

const PORT = process.env.PORT;
const FRONT_URL = process.env.FRONT_URL;

const app = express();

app.set('trust proxy', 1);

app.use(cors({ origin: FRONT_URL, credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

app.use(limiter);

app.use("/api/auth/", authRoutes);

app.use("/api/category/", categoryRouter);
app.use("/api/favourite/", favouriteRouter);
app.use("/api/product/", productRouter);
app.use("/api/review/", reviewRouter);
app.use("/api/user-action/", userActionRouter);

app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
