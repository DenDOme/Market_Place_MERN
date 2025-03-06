import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import authRoutes from "./routes/auth.route.js";
import {
  categoryRouter,
  favouriteRouter,
  productRouter,
  reviewRouter,
  userActionRouter,
} from "./routes/product.route.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many requests, please try again later.",
});
app.use(limiter);

app.use("/api/auth/", authRoutes);

app.use("/api/category/", categoryRouter);
app.use("/api/favourite/", favouriteRouter);
app.use("/api/product/", productRouter);
app.use("/api/review/", reviewRouter);
app.use("/api/user-action/", userActionRouter);

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
