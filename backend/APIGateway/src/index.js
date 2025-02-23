import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/authServices.route.js";
import orderRoutes from "./routes/orderServices.route.js";
import productRoutes from "./routes/productServices.route.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
